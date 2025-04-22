"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
}

const difficulties = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Intermédiaire" },
  { value: "hard", label: "Avancé" },
];

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: "",
    description: "",
    duration: 5,
    difficulty: "easy",
    active: true,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // État pour gérer la modal de suppression

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(data);
    };
    fetchActivities();
  }, []);
  
  const handleSave = async (activity: Partial<Activity>) => {
    if (editingActivity) {
      await fetch(`/api/activities`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });      
      setActivities(
        activities.map((a) =>
          a.id === editingActivity.id ? { ...a, ...activity } : a
        )
      );
      setEditingActivity(null);
    } else {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });
      const newActivity = await res.json();
      setActivities([...activities, newActivity]);
    }

    setNewActivity({
      title: "",
      description: "",
      duration: 5,
      difficulty: "easy",
      active: true,
    });
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/activities?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setActivities(activities.filter((activity) => activity.id !== id));
    } else {
      console.error("Erreur lors de la suppression de l'activité.");
    }
    setIsDeleteDialogOpen(false); // Fermer la modal après suppression
  };

  const ActivityForm = ({
    activity,
    onSave,
    onClose,
  }: {
    activity: Partial<Activity>;
    onSave: (activity: Partial<Activity>) => void;
    onClose?: () => void;
  }) => {
    const [formData, setFormData] = useState<Partial<Activity>>(activity);
  
    useEffect(() => {
      setFormData(activity);
    }, [activity]);
  
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
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration || 1}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulté</Label>
          <Select
            value={formData.difficulty || "easy"}
            onValueChange={(value: "easy" | "medium" | "hard") =>
              setFormData({ ...formData, difficulty: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une difficulté" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={() => {
          console.log("Form data:", formData); // ← ici
          onSave(formData);
        }}>
          {activity.id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    );
  };
  
  const getDifficultyLabel = (difficulty: string) => {
    return difficulties.find((d) => d.value === difficulty)?.label || difficulty;
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-6 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle activité
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle activité</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle activité.
                </DialogDescription>
              </DialogHeader>
              <ActivityForm activity={newActivity} onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="transform transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription>
                      {activity.duration} minutes • {getDifficultyLabel(activity.difficulty)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {editingActivity && (
                      <Dialog open onOpenChange={() => setEditingActivity(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier l'activité</DialogTitle>
                            <DialogDescription>
                              Modifiez les informations de l'activité.
                            </DialogDescription>
                          </DialogHeader>
                          <ActivityForm
                            activity={editingActivity}
                            onSave={handleSave}
                            onClose={() => setEditingActivity(null)}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingActivity(activity)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Êtes-vous sûr de vouloir supprimer cette activité ?</DialogTitle>
                          <DialogDescription>
                            Vous pourrez contacter un Super-Administrateur pour la récuperer.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (deleteActivity) handleDelete(deleteActivity.id);
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
                        setDeleteActivity(activity);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {activity.description}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      activity.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {activity.active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
