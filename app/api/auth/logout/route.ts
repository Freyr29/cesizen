import { closeSession } from '@/lib/auth';

// Route API pour la fermeture de la session
export async function DELETE(req: Request) {
  try {
    const { sessionToken } = await req.json();
    await closeSession(sessionToken);
    return new Response(JSON.stringify({ message: "Session fermée avec succès" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la fermeture de la session" }), { status: 500 });
  }
}
