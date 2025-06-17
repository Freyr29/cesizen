import { getSession, getUserById } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      console.log("Aucun cookie de session trouvé");
      return new Response(JSON.stringify({ error: "Token de session manquant" }), { status: 401 });
    }

    const session = await getSession(sessionToken);
    if (session.expireAt < Date.now()) {
      return new Response(JSON.stringify({ error: "Session expirée" }), { status: 401 });
    }

    const user = await getUserById(session.userId);
    return new Response(JSON.stringify({ session: { user } }), { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return new Response(JSON.stringify({ error: "Session invalide ou expirée" }), { status: 401 });
  }
}


