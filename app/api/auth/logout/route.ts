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

// Route API pour la fermeture de la session
export async function DELETE(req: Request) {
  try {
    const { sessionToken } = await req.json();
    await closeSession(sessionToken);
    return new Response(JSON.stringify({ message: "Session fermée avec succès" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la fermeture de la session" }), { status: 500 });
  }
}
