"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { AuthModal } from "./auth-modal";
import Image from "next/image";
import { ProfileModal } from "./profile-modal";
import { useState, useEffect } from "react";

export default function Navbar() {
  const menuItems = [
    { label: "Accueil", href: "/" },
    { label: "Informations", href: "/informations" },
    { label: "Diagnostic", href: "/diagnostic" },
    { label: "Exercices", href: "/exercises" },
    { label: "Activités", href: "/activities" },
    { label: "Utilisateurs", href: "/users_admin" },
  ];

  // État pour savoir si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté en fonction du sessionToken
  const checkSessionStatus = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    return !!sessionToken; // Retourne true si le token est trouvé
  };

  // Mettre à jour l'état de connexion à chaque changement dans le localStorage
  useEffect(() => {
    setIsLoggedIn(checkSessionStatus());
    
    // Ajouter un écouteur d'événements pour détecter les changements dans localStorage
    const handleStorageChange = () => {
      setIsLoggedIn(checkSessionStatus());
    };

    // Écoute le changement de session (ajout ou suppression du token dans localStorage)
    window.addEventListener("storage", handleStorageChange);

    // Nettoyage de l'écouteur d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Callback pour mettre à jour l'état isLoggedIn dans Navbar
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
              src="/images/cesizen_logo.png" 
              alt="Logo CESIZen"
              width={36} 
              height={36} 
              className="items-center"
            />
            <span className="text-xl font-bold">CESIZen</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <ModeToggle />
          
          {/* Affiche ProfileModal seulement si l'utilisateur est connecté */}
          {isLoggedIn && <ProfileModal />}
          
          {/* Affiche AuthModal seulement si l'utilisateur n'est pas connecté */}
          {!isLoggedIn && <AuthModal onLoginSuccess={handleLoginSuccess} />}
        </div>
      </div>
    </header>
  );
}
