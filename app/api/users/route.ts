import { NextApiRequest } from "next";
import mysql from "mysql2";
import { NextResponse } from "next/server";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const dynamic = "force-dynamic";

// Récupérer tous les utilisateurs
export async function GET(req: NextApiRequest) {
  return new Promise((resolve) => {
    pool.query("SELECT * FROM users WHERE active = 1", (err, results) => {
      if (err) {
        console.error("ERREUR SQL :", err);
        return resolve(
          NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
        );
      }
      resolve(NextResponse.json(results));
    });
  });
}

// Ajouter un nouvel utilisateur
export async function POST(req: Request) {
  const { nom, mail, password, role, active } = await req.json();

  return new Promise((resolve) => {
    pool.query(
      "INSERT INTO activities (id, nom, mail, password, role, active) VALUES (NULL, ?, ?, ?, ?, 1)",
      [nom, mail, password, role, active],
      (err, results) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return resolve(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }

        // Typage explicite du résultat pour inclure insertId
        const result = results as mysql.ResultSetHeader;  // Typage du résultat pour récupérer insertId

        // Réponse incluant id: null pour maintenir la structure attendue
        resolve(NextResponse.json({
          id: null,  // On retourne null pour id
          nom,
          mail,
          password,
          role,
          active,
        }));
      }
    );
  });
}

// Modifier un utilisateur
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, mail, role } = await req.json();

  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET nom = ?, mail = ?, role = ? WHERE id = ?",
      [nom, mail, role, id],
      (err) => {
        if (err) {
          console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
          return reject(NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 }));
        }
        resolve(NextResponse.json({ id, nom, mail, role }));
      }
    );
  });
}

// Supprimer un utilisateur
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  return new Promise((resolve) => {
    pool.query(
        "UPDATE users SET active = 0 WHERE id = ?",

      [id],
      (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'utilisateur :", err);
          return resolve(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }
        resolve(NextResponse.json({ message: "Utilisateur désactivé avec succès" }));
      }
    );
  });
}
