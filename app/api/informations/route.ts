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

// Récupérer tous les articles actifs
export async function GET(req: NextApiRequest) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM informations WHERE active = 1", (err, results) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return reject(NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 }));
      }
      resolve(NextResponse.json(results));
    });
  });
}

// Ajouter un nouvel article
export async function POST(req: Request) {
  const { title, description, url, source, category } = await req.json();

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO informations (title, description, url, source, category, active) VALUES (?, ?, ?, ?, ?, 1)", // active est mis à 1 par défaut
      [title, description, url, source, category],
      (err, results: mysql.ResultSetHeader) => { // Utilisation du type ResultSetHeader
        if (err) {
          console.error("Erreur lors de l'ajout de l'article :", err);
          return reject(NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 }));
        }

        // Utilisation correcte de insertId avec ResultSetHeader
        const insertId = results.insertId;
        resolve(NextResponse.json({ message: "Article ajouté avec succès", id: insertId }, { status: 201 }));
      }
    );
  });
}

// Mettre à jour un article
export async function PUT(req: Request) {
  const { id, title, description, url, source, category } = await req.json();

  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE informations SET title = ?, description = ?, url = ?, source = ?, category = ? WHERE id = ?",
      [title, description, url, source, category, id],
      (err) => {
        if (err) {
          console.error("Erreur lors de la mise à jour de l'article :", err);
          return reject(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }
        resolve(NextResponse.json({ message: "Article mis à jour avec succès" }, { status: 200 }));
      }
    );
  });
}

// Supprimer un article (désactivation)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);  // récupère les params de l'URL
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  return new Promise((resolve) => {
    // Désactiver l'article en mettant `active` à 0
    pool.query(
      "UPDATE informations SET active = 0 WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return resolve(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }
        resolve(NextResponse.json({ message: "Article désactivé" }));
      }
    );
  });
}
