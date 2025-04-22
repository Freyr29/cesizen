"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import de Select
import Link from "next/link";
import Image from "next/image";

interface Information {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
}

export default function InformationsAdminPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [informations, setInformations] = useState<Information[]>([]);
  const [editingInformation, setEditingInformation] = useState<Information | null>(null);
  const [newInformation, setNewInformation] = useState<Partial<Information>>({
    title: "",
    description: "",
    url: "",
    source: "",
    category: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteInformation, setDeleteInformation] = useState<Information | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // État pour gérer l'ouverture de la modal

  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const res = await fetch("/api/informations");  // Appel à l'API pour récupérer les articles
        if (res.ok) {
          const data = await res.json();
          setInformations(data);  // Mise à jour de l'état avec les articles récupérés
        } else {
          setErrorMessage("Erreur lors de la récupération des articles.");
        }
      } catch (error) {
        setErrorMessage("Erreur de connexion au serveur.");
        console.error(error);
      }
    };
    fetchInformations();
  }, []);

  const handleSave = async (information: Partial<Information>) => {
    if (editingInformation) {
      await fetch(`/api/informations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
      });
      setInformations(
        informations.map((i) =>
          i.id === editingInformation.id ? { ...i, ...information } : i
        )
      );
      setEditingInformation(null);
    } else {
      const res = await fetch("/api/informations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
      });
  
      // Assurez-vous que l'article a bien été ajouté avant de récupérer les données
      if (res.ok) {
        const newInformation = await res.json();
        setInformations((prevInformations) => [...prevInformations, newInformation]);
  
        // Recharger les informations de la base de données pour s'assurer que tout est à jour
        const refreshedData = await fetch("/api/informations");
        const refreshedInformations = await refreshedData.json();
        setInformations(refreshedInformations);

        setIsModalOpen(false); // Fermer la modal après l'ajout
      }
    }
  
    setNewInformation({
      title: "",
      description: "",
      url: "",
      source: "",
      category: "",
    });
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/informations?id=${id}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      // Rafraîchir la liste des informations après suppression
      const updatedInformations = await fetch("/api/informations");
      const data = await updatedInformations.json();
      setInformations(data);  // Mettre à jour les articles dans l'état
    } else {
      const data = await res.json();
      console.error("Erreur lors de la suppression de l'article:", data.error);  // Afficher l'erreur dans la console
    }
    setIsDeleteDialogOpen(false);  // Fermer la modal après suppression
  };

  const InformationForm = ({
    information,
    onSave,
    onClose,
  }: {
    information: Partial<Information>;
    onSave: (information: Partial<Information>) => void;
    onClose?: () => void;
  }) => {
    const [formData, setFormData] = useState<Partial<Information>>(information);

    useEffect(() => {
      setFormData(information);
    }, [information]);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={formData.url || ""}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={formData.source || ""}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value: string) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stress">Stress</SelectItem>
              <SelectItem value="Bien-être">Bien-être</SelectItem>
              <SelectItem value="Dépression">Dépression</SelectItem>
              <SelectItem value="Sommeil">Sommeil</SelectItem>
              <SelectItem value="Activité physique">Activité physique</SelectItem>
              <SelectItem value="Anxiété">Anxiété</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={() => onSave(formData)}>
          {information.id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    );
  };

  const categories: string[] = Array.from(new Set(informations.map(information => information.category)));

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
        <div className="mb-6 flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel article</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouvel article.
                </DialogDescription>
              </DialogHeader>
              <InformationForm 
                information={newInformation} 
                onSave={handleSave}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Afficher un message d'erreur si nécessaire */}
        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {informations
                .filter(information => information.category === category)
                .map((information) => (
                  <Card key={information.id} className="transform transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{information.title}</CardTitle>
                          <CardDescription>{information.source}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {editingInformation && (
                            <Dialog open onOpenChange={() => setEditingInformation(null)}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier l'article</DialogTitle>
                                  <DialogDescription>
                                    Modifiez les informations de l'article.
                                  </DialogDescription>
                                </DialogHeader>
                                <InformationForm
                                  information={editingInformation}
                                  onSave={handleSave}
                                  onClose={() => setEditingInformation(null)}
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingInformation(information)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Êtes-vous sûr de vouloir supprimer cet article ?</DialogTitle>
                                <DialogDescription>
                                  Vous pourrez contacter un Super-Administrateur pour le récupérer.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Annuler
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    if (deleteInformation) handleDelete(deleteInformation.id);
                                  }}
                                >
                                  Supprimer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setDeleteInformation(information);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{information.description}</p>
                      <Link
                        href={information.url || "#"} // Si `url` est undefined ou vide, utilise "#" comme valeur par défaut
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
