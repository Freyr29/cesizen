import { getSession, getUserById } from '@/lib/auth';

// Route API pour récupérer la session et les informations de l'utilisateur
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Token manquant ou mal formé dans l'en-tête Authorization");
      return new Response(JSON.stringify({ error: "Token de session manquant" }), { status: 401 });
    }

    const sessionToken = authHeader.split(" ")[1];

    const session = await getSession(sessionToken); // Récupérer la session

    if (session.expireAt < Date.now()) {
      return new Response(JSON.stringify({ error: "Session expirée" }), { status: 401 });
    }

    // Récupérer les informations de l'utilisateur à partir du userId de la session
    const user = await getUserById(session.userId);  // Utilise l'userId de la session pour récupérer les infos de l'utilisateur

    return new Response(JSON.stringify({ session: { user } }), { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return new Response(JSON.stringify({ error: "Session invalide ou expirée" }), { status: 401 });
  }
}
