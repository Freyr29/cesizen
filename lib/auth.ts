// lib/auth.ts
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

type Session = {
  userId: string;
  sessionToken: string;
  expireAt: number;
  createdAt: number;
};

export type User = {
  userId: string;
  nom: string;
  mail: string;
  password: string;
  role: string;
};

export const authenticateUser = async (mail: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE mail = ?',
      [mail],
      async (err, results: mysql.RowDataPacket[]) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('Utilisateur non trouvé');
        const user = results[0] as User;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return reject('Mot de passe incorrect');
        resolve(user);
      }
    );
  });
};

export const createSession = (userId: string): Promise<string> => {
  const sessionToken = crypto.randomBytes(64).toString('hex');
  const expireAt = Date.now() + 3600000;

  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO session (userId, sessionToken, expireAt) VALUES (?, ?, ?)',
      [userId, sessionToken, expireAt],
      (err) => {
        if (err) return reject(err);
        resolve(sessionToken);
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

// Fonction pour vérifier si un email est déjà utilisé
const checkIfEmailExists = (mail: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE mail = ?',
      [mail],
      (err, results: mysql.RowDataPacket[]) => {
        if (err) {
          console.error("Erreur lors de la vérification de l'email", err);
          return reject(err);
        }
        resolve(results.length > 0); // Si des résultats existent, l'email est déjà utilisé
      }
    );
  });
};

// Fonction pour créer un utilisateur avec vérification de l'email
export const createUser = async (nom: string, mail: string, password: string, role: string) => {
  const emailExists = await checkIfEmailExists(mail);
  if (emailExists) {
    return Promise.reject("L'email est déjà utilisé");
  }

  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(password, 12); // Hash du mot de passe
  
    pool.query(
      "INSERT INTO users (nom, mail, password, role) VALUES (?, ?, ?, 'Utilisateur')",
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
export const getUserById = (userId: string): Promise<User> => {
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