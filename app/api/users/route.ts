import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise"; // Utilise la version `promise` ici

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const dynamic = "force-dynamic";

// Récupérer tous les utilisateurs
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const [results] = await pool.query("SELECT * FROM users WHERE active = 1");
    return NextResponse.json(results);
  } catch (err) {
    console.error("ERREUR SQL :", err);
    return NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 });
  }
}

// Ajouter un nouvel utilisateur
export async function POST(req: Request): Promise<Response> {
  const { nom, mail, password, role, active } = await req.json();

  try {
    const [results] = await pool.query(
      "INSERT INTO users (nom, mail, password, role, active) VALUES (?, ?, ?, ?, ?)",
      [nom, mail, password, role, active]
    );

    const insertId = (results as mysql.ResultSetHeader).insertId;

    return NextResponse.json({
      id: insertId,
      nom,
      mail,
      password,
      role,
      active,
    }, { status: 201 });
  } catch (err) {
    console.error("Erreur SQL :", err);
    return NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 });
  }
}

// Modifier un utilisateur
export async function PUT(req: Request): Promise<Response> {
  const { id, nom, mail, role } = await req.json();

  try {
    await pool.query(
      "UPDATE users SET nom = ?, mail = ?, role = ? WHERE id = ?",
      [nom, mail, role, id]
    );

    return NextResponse.json({ id, nom, mail, role }, { status: 200 });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    return NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 });
  }
}

// Supprimer (désactiver) un utilisateur
export async function DELETE(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await pool.query(
      "UPDATE users SET active = 0 WHERE id = ?",
      [id]
    );

    return NextResponse.json({ message: "Utilisateur désactivé avec succès" }, { status: 200 });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur :", err);
    return NextResponse.json({ error: "Erreur interne du serveur", details: err }, { status: 500 });
  }
}
