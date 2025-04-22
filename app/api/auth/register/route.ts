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

// Route API pour la création d'un utilisateur
export async function POST(req: Request) {
  try {
    const { nom, mail, password, role } = await req.json();
    await createUser(nom, mail, password, role); // Cette fonction vérifie maintenant l'email
    return new Response(JSON.stringify({ message: "Utilisateur créé avec succès" }), { status: 201 });
  } catch (error) {
    if (error === "L'email est déjà utilisé") {
      return new Response(JSON.stringify({ error: "L'email est déjà utilisé" }), { status: 400 }); // Erreur 400 pour email déjà pris
    }
    return new Response(JSON.stringify({ error: "Erreur lors de la création de l'utilisateur" }), { status: 500 });
  }
}
