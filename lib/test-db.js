require("dotenv").config();
const mysql = require("mysql2");

// Création de la connexion
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Test de la connexion
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie !");
  connection.end(); // Ferme la connexion après le test
});
