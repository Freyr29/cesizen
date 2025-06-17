import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Récupérer tous les articles actifs
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const [results] = await pool.promise().query("SELECT * FROM informations WHERE active = 1");
    return NextResponse.json(results);
  } catch (err) {
    console.error("Erreur SQL :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: err },
      { status: 500 }
    );
  }
}


// Ajouter un nouvel article
export async function POST(req: Request): Promise<Response> {
  const { title, description, url, source, category } = await req.json();

  try {
    const [results] = await pool.promise().query(
      "INSERT INTO informations (title, description, url, source, category, active) VALUES (?, ?, ?, ?, ?, 1)",
      [title, description, url, source, category]
    );

    const insertId = (results as mysql.ResultSetHeader).insertId;

    return NextResponse.json({ message: "Article ajouté avec succès", id: insertId }, { status: 201 });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'article :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: err },
      { status: 500 }
    );
  }
}


// Mettre à jour un article
export async function PUT(req: Request): Promise<Response> {
  const { id, title, description, url, source, category } = await req.json();

  try {
    await pool.promise().query(
      "UPDATE informations SET title = ?, description = ?, url = ?, source = ?, category = ? WHERE id = ?",
      [title, description, url, source, category, id]
    );

    return NextResponse.json({ message: "Article mis à jour avec succès" }, { status: 200 });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'article :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: err },
      { status: 500 }
    );
  }
}


// Supprimer un article (désactivation)
export async function DELETE(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await pool.promise().query(
      "UPDATE informations SET active = 0 WHERE id = ?",
      [id]
    );

    return NextResponse.json({ message: "Article désactivé" }, { status: 200 });
  } catch (err) {
    console.error("Erreur SQL :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: err },
      { status: 500 }
    );
  }
}
