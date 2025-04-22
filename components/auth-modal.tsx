import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AuthModal({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  // States pour la gestion des champs de connexion/inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Par défaut "user" pour le rôle

  // State pour afficher les erreurs
  const [errorMessage, setErrorMessage] = useState("");

  // Connexion de l'utilisateur
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire
    console.log("Données envoyées pour la connexion:", { mail: email, password });
  
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: email, password }),
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log("Connexion réussie, token de session:", data.sessionToken);
      localStorage.setItem("sessionToken", data.sessionToken); // Stocker le token de session
      setOpen(false); // Fermer la modal après la connexion
      onLoginSuccess(); // Mettre à jour l'état de connexion dans Navbar
    } else {
      const data = await res.json();
      setErrorMessage(data.error || "Erreur lors de la connexion");
    }
  };

  // Inscription de l'utilisateur
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom: name, mail: email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Utilisateur créé avec succès:", data.message);
      // Lancer la fonction de connexion après une inscription réussie
      handleLogin(e);  
    } else {
      setErrorMessage(data.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Se connecter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bienvenue sur CESIZen</DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez un compte pour accéder à toutes les fonctionnalités.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

        <Tabs className="w-full" defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          {/* Connexion */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </TabsContent>

          {/* Inscription */}
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nom complet</Label>
                <Input
                  id="register-name"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password-confirm">Confirmer le mot de passe</Label>
                <Input
                  id="register-password-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Créer un compte
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
