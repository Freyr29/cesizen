"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
      <Image 
        src="/images/cesizen_logo.png" 
        alt="Logo CESIZen"
        width={96} 
        height={96} 
        className="mb-8"
      />
      <h1 className="text-5xl font-bold text-center mb-6">
        Bienvenue sur CESIZen
      </h1>
      <p className="text-xl text-center text-muted-foreground max-w-[600px] mb-12">
        Bonjour et bienvenu sur l'application Cesizen
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" variant="outline">
          <Link href="/informations">Consulter les informations</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/diagnostic">Commencer le diagnostic</Link>
        </Button>
      </div>
      <br />
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/exercises">Découvrir les exercices</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/activities">Participer à une activité</Link>
        </Button>
      </div>
    </div>
  );
}
