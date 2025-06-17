// app/api/activities/route.ts
import { NextRequest } from "next/server"; // Utilisation de NextRequest
import mysql from "mysql2";
import { NextResponse } from "next/server"; // Utilisation de NextResponse

// Connexion à la base de données
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Requête GET pour récupérer les activités actives
export async function GET(req: NextRequest) {
  try {
    // Exécution de la requête SQL
    const results = await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM activities WHERE active = 1", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Retourner la réponse avec les résultats récupérés
    return NextResponse.json(results);
  } catch (err) {
    // Si une erreur survient, retourner une réponse d'erreur
    return NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 });
  }
}

// Ajouter une activité
export async function POST(req: NextRequest) {
  const { title, description, duration, difficulty, active } = await req.json();

  try {
    // Typage explicite des résultats attendus (ResultSetHeader)
    const result = await new Promise<mysql.ResultSetHeader>((resolve, reject) => {
      pool.query(
        "INSERT INTO activities (title, description, duration, difficulty, active) VALUES (?, ?, ?, ?, ?)",
        [title, description, duration, difficulty, active],
        (err, results) => {
          if (err) {
            reject(err); // Rejeter la promesse si une erreur survient
          } else {
            resolve(results as mysql.ResultSetHeader); // Résoudre la promesse avec ResultSetHeader
          }
        }
      );
    });

    // Récupérer l'insertId depuis le résultat de l'insertion
    const insertedId = result.insertId;

    // Renvoi de la réponse avec les données de l'activité ajoutée
    return NextResponse.json({
      id: insertedId, // ID de l'activité insérée
      title,
      description,
      duration,
      difficulty,
      active,
    });

  } catch (err) {
    // Si erreur lors de la requête SQL, renvoyer un message d'erreur
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: err },
      { status: 500 }
    );
  }
}

// Mettre à jour une activité
export async function PUT(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { id, title, description, duration, difficulty, active } = body;

  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE activities SET title = ?, description = ?, duration = ?, difficulty = ?, active = ? WHERE id = ?",
      [title, description, duration, difficulty, active, id],
      (err, results) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return reject(NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 }));
        }

        // Résoudre avec une réponse JSON
        resolve(NextResponse.json({ id, title, description, duration, difficulty, active }));
      }
    );
  });
}

// Supprimer une activité
export async function DELETE(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);  // récupère les params de l'URL
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    // Mettre à jour le champ `active` à 0 au lieu de supprimer l'activité
    pool.query(
      "UPDATE activities SET active = 0 WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return reject(NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 }));
        }
        resolve(NextResponse.json({ message: "Activité désactivée" }));
      }
    );
  });
}