import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

type User = {
  userId: string;
  nom: string;
  mail: string;
  password: string;
  role: string;
};

type Session = {
    userId: string;
    sessionToken: string;
    expireAt: number;
    createdAt: number;
};

// Fonction pour vérifier l'authentification d'un utilisateur
export const authenticateUser = async (mail: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE mail = ?',
      [mail],
      async (err, results: mysql.RowDataPacket[]) => {
        if (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur', err);
          return reject(err);
        }
        if (results.length === 0) {
          return reject('Utilisateur non trouvé');
        }
        const user = results[0] as User; // Casting explicite en tant que `User`
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return reject('Mot de passe incorrect');
        }
        resolve(user);
      }
    );
  });
};

// Fonction pour créer une session après une connexion réussie
export const createSession = (userId: string): Promise<string> => {
  const sessionToken = crypto.randomBytes(64).toString('hex'); // Génération du token unique
  const expireAt = Date.now() + 3600000; // Session expire dans 1 heure (en ms)
  
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO session (userId, sessionToken, expireAt) VALUES (?, ?, ?)',
      [userId, sessionToken, expireAt],
      (err) => {
        if (err) {
          console.error('Erreur lors de la création de la session', err);
          return reject(err);
        }
        resolve(sessionToken);
      }
    );
  });
};


// Route API pour l'authentification d'un utilisateur (connexion)
export async function POST(req: Request) {
  try {
    const { mail, password } = await req.json();
    const user = await authenticateUser(mail, password);
    const sessionToken = await createSession(user.userId);
    return new Response(JSON.stringify({ user, sessionToken }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Échec de l'authentification" }), { status: 401 });
  }
}
