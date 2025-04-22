"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Définir l'interface utilisateur
interface User {
  id: string;
  mail: string;
  nom: string;
  password: string;
  role: 'user' | 'admin';
}

const roles = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'admin', label: 'Administrateur' }
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    mail: "",
    nom: "",
    role: 'user'
  });

  // Fetcher les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      
      if (res.ok) {
        setUsers(data);
      } else {
        console.error("Erreur dans la récupération des utilisateurs :", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sauvegarder un utilisateur (ajout ou modification)
  const handleSave = async (user: Partial<User>) => {
    if (editingUser) {
      await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      setUsers(
        users.map((u) => 
          (u.id === editingUser.id ? { ...u, ...user } : u
        ))
      );
      setEditingUser(null);
    } else {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
    }

    setNewUser({ mail: "", nom: "", role: 'user' });
  };

  // Supprimer un utilisateur
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/users?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setUsers(users.filter((user) => user.id !== id));
    } else {
      console.error("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  // Formulaire d'utilisateur (création / modification)
  const UserForm = ({
    user,
    onSave,
  }: {
    user: Partial<User>;
    onSave: (user: Partial<User>) => void;
  }) => {
    const [formData, setFormData] = useState(user);

    useEffect(() => {
      setFormData(user);
    }, [user]);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mail">mail</Label>
          <Input
            id="mail"
            type="mail"
            value={formData.mail || ""}
            onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            value={formData.nom || ""}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select
            value={formData.role}
            onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={formData.password || ""}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <Button className="w-full" onClick={() => onSave(formData)}>
          {user.id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    );
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-6 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouvel utilisateur.
                </DialogDescription>
              </DialogHeader>
              <UserForm user={newUser} onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}> {/* Ajout de la clé unique */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{user.nom}</CardTitle>
                    <CardDescription>{user.mail}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier l'utilisateur</DialogTitle>
                          <DialogDescription>
                            Modifiez les informations de l'utilisateur.
                          </DialogDescription>
                        </DialogHeader>
                        <UserForm user={user} onSave={handleSave} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
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
