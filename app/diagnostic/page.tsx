"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

interface StressEvent {
  id: string;
  title: string;
  points: number;
  selected: boolean;
}

const stressEvents: StressEvent[] = [
  { id: "1", title: "Décès d'un conjoint", points: 100, selected: false },
  { id: "2", title: "Divorce", points: 73, selected: false },
  { id: "3", title: "Séparation conjugale", points: 65, selected: false },
  { id: "4", title: "Emprisonnement", points: 63, selected: false },
  { id: "5", title: "Décès d'un proche parent", points: 63, selected: false },
  { id: "6", title: "Blessure ou maladie grave", points: 53, selected: false },
  { id: "7", title: "Mariage", points: 50, selected: false },
  { id: "8", title: "Perte d'un emploi", points: 47, selected: false },
  { id: "9", title: "Réconciliation conjugale", points: 45, selected: false },
  { id: "10", title: "Retraite", points: 45, selected: false },
  { id: "11", title: "Changement majeur dans la santé d'un membre de la famille", points: 44, selected: false },
  { id: "12", title: "Grossesse", points: 40, selected: false },
  { id: "13", title: "Difficultés sexuelles", points: 39, selected: false },
  { id: "14", title: "Arrivée d'un nouvel enfant dans la famille", points: 39, selected: false },
  { id: "15", title: "Changement majeur dans les finances personnelles", points: 38, selected: false },
  { id: "16", title: "Changement majeur de responsabilités professionnelles", points: 29, selected: false },
  { id: "17", title: "Déménagement", points: 20, selected: false },
  { id: "18", title: "Changement d'école ou d'études", points: 20, selected: false },
  { id: "19", title: "Vacances", points: 13, selected: false },
  { id: "20", title: "Petite infraction à la loi", points: 11, selected: false }
];

export default function DiagnosticPage() {
  const [events, setEvents] = useState<StressEvent[]>(stressEvents);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const toggleEvent = (id: string) => {
    const newEvents = events.map(event => {
      if (event.id === id) {
        return { ...event, selected: !event.selected };
      }
      return event;
    });
    setEvents(newEvents);
    
    const score = newEvents
      .filter(event => event.selected)
      .reduce((sum, event) => sum + event.points, 0);
    setTotalScore(score);
  };

  const getStressLevel = (score: number) => {
    if (score < 150) return { level: "Faible", description: "Stress faible, risque de maladies liées au stress peu élevé." };
    if (score <= 300) return { level: "Modéré", description: "Stress modéré, risque accru de problèmes de santé." };
    return { level: "Élevé", description: "Stress élevé, risque important de maladies liées au stress (dépression, troubles cardiaques, affaiblissement du système immunitaire, etc.)." };
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Diagnostic de stress</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Évaluez votre niveau de stress selon l'échelle de Holmes et Rahe en sélectionnant les événements qui vous concernent sur les 12 derniers mois.
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Événements de vie récents</CardTitle>
            <CardDescription>Sélectionnez les événements qui vous concernent sur les 12 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map(event => (
                <div 
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors
                    ${event.selected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                  onClick={() => toggleEvent(event.id)}
                >
                  <div className="flex justify-between items-center">
                    <span>{event.title}</span>
                    <span className="font-semibold">{event.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => setShowResult(true)}
            className="mb-8"
          >
            Voir mon niveau de stress
          </Button>

          {showResult && (
            <Card>
              <CardHeader>
                <CardTitle>Votre score : {totalScore} points</CardTitle>
                <CardDescription>
                  Niveau de stress : {getStressLevel(totalScore).level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {getStressLevel(totalScore).description}
                </p>
                {totalScore > 150 && (
                  <p className="mt-4 text-muted-foreground">
                    Prenez soin de vous et envisagez des solutions pour mieux gérer votre stress (techniques de relaxation, sport, thérapie, etc.).
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}