import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { mail, password } = await req.json();

    // Vérifie l'utilisateur
    const user = await authenticateUser(mail, password);

    // Crée une session et récupère le token
    const sessionToken = await createSession(user.userId);

    // Crée un cookie HTTP-only pour stocker le token
  const response = NextResponse.json({ message: 'Utilisateur authentifié', user, sessionToken });
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1 heure
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Erreur d\'authentification :', error);
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
  }
}
