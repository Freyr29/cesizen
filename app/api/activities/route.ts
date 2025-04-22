// app/api/activities/route.ts
import { NextApiRequest } from "next";
import mysql from "mysql2";
import dotenv from "dotenv";
import { NextResponse } from "next/server";

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// let cache: any = null;

export const dynamic = "force-dynamic";

export async function GET(req: NextApiRequest) {
  return new Promise((resolve) => {
    pool.query("SELECT * FROM activities WHERE active = 1", (err, results) => {
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

export async function POST(req: Request) {
  const { title, description, duration, difficulty, active } = await req.json();

  return new Promise((resolve) => {
    pool.query(
      "INSERT INTO activities (id, title, description, duration, difficulty, active) VALUES (NULL, ?, ?, ?, ?, 1)",
      [title, description, duration, difficulty, active],
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
          title,
          description,
          duration,
          difficulty,
          active,
        }));
      }
    );
  });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, title, description, duration, difficulty, active } = body;

  return new Promise((resolve) => {
    pool.query(
      "UPDATE activities SET title = ?, description = ?, duration = ?, difficulty = ?, active = ? WHERE id = ?",
      [title, description, duration, difficulty, active, id],
      (err) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return resolve(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }
        resolve(NextResponse.json({ id, title, description, duration, difficulty, active }));
      }
    );
  });
}

// Supprimer une activité
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);  // récupère les params de l'URL
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  return new Promise((resolve) => {
    // Mettre à jour le champ `active` à 0 au lieu de supprimer l'activité
    pool.query(
      "UPDATE activities SET active = 0 WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return resolve(
            NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 })
          );
        }
        resolve(NextResponse.json({ message: "Activité désactivée" }));
      }
    );
  });
}
