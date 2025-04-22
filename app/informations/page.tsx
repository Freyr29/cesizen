"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function InformationsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Récupérer les articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/informations");  // Appel à l'API pour récupérer les articles
        if (res.ok) {
          const data = await res.json();
          setArticles(data);  // Mise à jour de l'état avec les articles récupérés
        } else {
          setErrorMessage("Erreur lors de la récupération des articles.");
        }
      } catch (error) {
        setErrorMessage("Erreur de connexion au serveur.");
        console.error(error);
      }
    };

    fetchArticles();
  }, []);

  // Récupérer toutes les catégories d'articles (enlever les doublons)
  const categories: string[] = Array.from(new Set(articles.map(article => article.category)));

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ressources et Articles</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Une sélection d'articles et de ressources pour mieux comprendre et prendre soin de votre santé mentale.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image 
              src="/images/cesizen_logo.png" 
              alt="Logo CESIZen"
              width={96} 
              height={96} 
              className="mb-8"
            />
          </div>
        </div>

        {/* Afficher un message d'erreur si nécessaire */}
        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        {/* Afficher les articles par catégorie */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {articles
                .filter(article => article.category === category)
                .map(article => (
                  <Card key={article.id} className="transform transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">{article.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Source : {article.source}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        {article.description}
                      </p>
                      <Link 
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Lire l'article →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
