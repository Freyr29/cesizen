"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ExercisesPage() {
  const exercises = [
    {
      id: "46",
      title: "Technique 4-6",
      description: "Idéal pour débuter la cohérence cardiaque",
      inspiration: 4,
      apnee: 0,
      expiration: 6,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
      difficulty: "Débutant"
    },
    {
      id: "55",
      title: "Technique 5-5",
      description: "Une respiration équilibrée pour la détente",
      inspiration: 5,
      apnee: 0,
      expiration: 5,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      difficulty: "Intermédiaire"
    },
    {
      id: "748",
      title: "Technique 7-4-8",
      description: "Une technique avancée pour une relaxation profonde",
      inspiration: 7,
      apnee: 4,
      expiration: 8,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
      difficulty: "Avancé"
    },
  ];

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Cohérence Cardiaque</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Découvrez différentes techniques de respiration adaptées à votre niveau pour améliorer votre cohérence cardiaque.
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="transform transition-all duration-300 hover:scale-105">
              <CardHeader className={`${exercise.color} rounded-t-lg`}>
                <CardTitle className={`text-lg sm:text-xl ${exercise.textColor}`}>
                  {exercise.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base font-medium">
                  Niveau : {exercise.difficulty}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {exercise.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center py-3">
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{exercise.inspiration}s</p>
                      <p className="text-xs text-muted-foreground">Inspiration</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{exercise.apnee}s</p>
                      <p className="text-xs text-muted-foreground">Apnée</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{exercise.expiration}s</p>
                      <p className="text-xs text-muted-foreground">Expiration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}