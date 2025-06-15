"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ProfileModal() {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null); // Pour stocker les infos de l'utilisateur
  const [errorMessage, setErrorMessage] = useState("");

  // Vérifier si l'utilisateur est connecté (token de session dans localStorage)
  const checkUserSession = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      setErrorMessage("Veuillez vous connecter pour voir votre profil");
      return false; // Pas connecté
    }
    return true; // Utilisateur connecté
  };

  // Récupérer les informations de l'utilisateur via l'API
  const fetchUserProfile = async () => {
    const sessionToken = localStorage.getItem("sessionToken"); // Récupérer le token de session
    if (!sessionToken) {
      setErrorMessage("Aucune session trouvée");
      return;
    }

    const res = await fetch("/api/auth/session", { // Appel à l'API pour récupérer la session
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`, // En-tête avec le token de session
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUserProfile(data.session.user); // Supposons que l'API retourne les informations de l'utilisateur
    } else {
      const data = await res.json();
      console.error("Erreur lors de la récupération de la session"); // Log des erreurs du serveur
      setErrorMessage(data.error || "Impossible de récupérer les informations de l'utilisateur");
    }
  };

  // Se déconnecter en supprimant la session
  const handleLogout = async () => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      const res = await fetch("/api/auth/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }), // Envoyer le token de session pour la déconnexion
      });
  
      if (res.ok) {
        localStorage.removeItem("sessionToken"); // Supprimer le token de session
        setUserProfile(null); // Réinitialiser les informations de l'utilisateur
        setOpen(false); // Fermer la modal
        window.location.reload(); // Rafraîchissement de la page après la déconnexion
      } else {
        setErrorMessage("Erreur lors de la déconnexion");
      }
    }
  };

  // Ne récupérer les informations de l'utilisateur que si l'utilisateur est connecté
  useEffect(() => {
    if (checkUserSession()) {
      fetchUserProfile(); // Récupérer les infos de l'utilisateur seulement si connecté
    }
  }, [open]); // Appel au changement de l'état de la modal

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <UserCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profil Utilisateur</DialogTitle>
          <DialogDescription>
            Vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

        {userProfile ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <p className="text-sm text-muted-foreground">{userProfile.nom}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{userProfile.mail}</p>
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <p className="text-sm text-muted-foreground">{userProfile.role}</p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Chargement...</div>
        )}

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            Modifier le profil
          </Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
