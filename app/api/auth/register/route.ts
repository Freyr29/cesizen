import { createUser } from '@/lib/auth';

// Route API pour la création d'un utilisateur
export async function POST(req: Request) {
  try {
    const { nom, mail, password, role } = await req.json();
    await createUser(nom, mail, password, role); // Cette fonction vérifie maintenant l'email
    return new Response(JSON.stringify({ message: "Utilisateur créé avec succès" }), { status: 201 });
  } catch (error) {
    if (error === "L'email est déjà utilisé") {
      return new Response(JSON.stringify({ error: "L'email est déjà utilisé" }), { status: 400 }); // Erreur 400 pour email déjà pris
    }
    return new Response(JSON.stringify({ error: "Erreur lors de la création de l'utilisateur" }), { status: 500 });
  }
}
