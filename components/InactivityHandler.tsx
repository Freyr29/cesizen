"use client";

import { useEffect } from "react";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes en millisecondes

export default function InactivityHandler() {
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    // Fonction pour réinitialiser le timer d'inactivité
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer); // Annuler le précédent timer
      inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT); // Démarrer un nouveau timer
    };

    // Fonction qui gère la déconnexion après un certain temps d'inactivité
    const handleInactivity = () => {
      console.log("Utilisateur inactif depuis 30 minutes, déconnexion...");
      
      // Appel pour fermer la session côté serveur
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        fetch("/api/auth/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionToken }), // Envoie du token de session
        }).then(() => {
          localStorage.removeItem("sessionToken"); // Supprimer le token du localStorage
          // Rafraîchissement de la page après la déconnexion
          window.location.reload(); // Rafraîchir la page
        });
      }
    };

    // Écouter les événements pour réinitialiser l'inactivité
    const activityEvents = ["mousemove", "keydown", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    // Démarrer le timer à la première connexion
    resetInactivityTimer();

    // Nettoyer les écouteurs d'événements au démontage du composant
    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      clearTimeout(inactivityTimer); // Annuler le timer lors du démontage du composant
    };
  }, []);

  return null; // Ce composant ne rend rien
}