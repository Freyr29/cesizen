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

// Fonction pour créer un utilisateur
export const createUser = (nom: string, mail: string, password: string, role: string) => {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10); // Hash du mot de passe
  
      pool.query(
        "INSERT INTO users (nom, mail, password, role) VALUES (?, ?, ?, ?)",
        [nom, mail, hashedPassword, role],
        (err) => {
          if (err) {
            console.error("Erreur lors de la création de l'utilisateur:", err);
            return reject(err);
          }
          resolve("Utilisateur créé avec succès");
        }
      );
    });
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
  const sessionToken = crypto.randomBytes(64).toString('hex'); // Génération d'un token unique
  const expireAt = Date.now() + 3600000; // Session expire dans 1 heure
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO session (userId, sessionToken, expireAt) VALUES (?, ?, ?)',
      [userId, sessionToken, expireAt],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de la création de la session', err);
          return reject(err);
        }
        resolve(sessionToken);
      }
    );
  });
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
            return reject('Session expirée ou invalide');
          }
          const session = results[0] as Session; // Casting explicite en tant que `Session`
          resolve(session);
        }
      );
    });
};

// Fonction pour fermer une session
export const closeSession = (sessionToken: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM session WHERE sessionToken = ?',
      [sessionToken],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de la fermeture de la session', err);
          return reject(err);
        }
        resolve();
      }
    );
  });
};
