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
