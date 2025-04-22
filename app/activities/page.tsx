"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]); // Spécifie le type ici
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activities");
    
        const text = await response.text();
    
        const data = JSON.parse(text);
        setActivities(data);
      } catch (error) {
        console.error("Erreur lors du chargement des activités :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Activités de détente</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Découvrez une sélection d'activités pour améliorer votre bien-être mental et réduire votre stress.
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

        {loading ? (
          <p className="text-center text-lg">Chargement des activités...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="transform transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">{activity.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Durée : {activity.duration} minutes
                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-primary/10">
                      {activity.difficulty}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">{activity.description}</p>
                  <Button className="w-full">Voir le détail</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
