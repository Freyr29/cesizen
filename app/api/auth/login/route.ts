import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { mail, password } = await req.json();
    const user = await authenticateUser(mail, password);

    return NextResponse.json({ message: 'Utilisateur authentifié', user });
  } catch (error) {
    console.error('Erreur d\'authentification :', error);
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
  }
}
