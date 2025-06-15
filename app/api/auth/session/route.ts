import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

type Session = {
  userId: string;
  sessionToken: string;
  expireAt: number;
  createdAt: number;
};

type User = {
  userId: string;
  nom: string;
  mail: string;
  role: string;
};

// Fonction pour récupérer une session en utilisant le token
export const getSession = (sessionToken: string): Promise<Session> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM session WHERE sessionToken = ? AND expireAt > ?',
      [sessionToken, Date.now()],
      (err, results: mysql.RowDataPacket[]) => {
        if (err) {
          console.error('Erreur lors de la récupération de la session', err);
          return reject(err);
        }
        if (results.length === 0) {
          return reject('Session invalide ou expirée');
        }
        const session = results[0] as Session;
        resolve(session);
      }
    );
  });
};

// Fonction pour récupérer les informations de l'utilisateur par son ID
const getUserById = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT userId, nom, mail, role FROM users WHERE userId = ?',
      [userId],
      (err, results: mysql.RowDataPacket[]) => {
        if (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur', err);
          return reject(err);
        }
        if (results.length === 0) {
          return reject('Utilisateur non trouvé');
        }
        const user = results[0] as User;
        resolve(user);
      }
    );
  });
};

// Route API pour récupérer la session et les informations de l'utilisateur
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Token manquant ou mal formé dans l'en-tête Authorization");
      return new Response(JSON.stringify({ error: "Token de session manquant" }), { status: 401 });
    }

    const sessionToken = authHeader.split(" ")[1];

    const session = await getSession(sessionToken); // Récupérer la session

    if (session.expireAt < Date.now()) {
      return new Response(JSON.stringify({ error: "Session expirée" }), { status: 401 });
    }

    // Récupérer les informations de l'utilisateur à partir du userId de la session
    const user = await getUserById(session.userId);  // Utilise l'userId de la session pour récupérer les infos de l'utilisateur

    return new Response(JSON.stringify({ session: { user } }), { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return new Response(JSON.stringify({ error: "Session invalide ou expirée" }), { status: 401 });
  }
}
