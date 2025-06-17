import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSession, pool } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { nom, mail, password } = await req.json();

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la base
    const [result]: any = await pool.promise().query(
      'INSERT INTO users (nom, mail, password, role, active) VALUES (?, ?, ?, ?, ?)',
      [nom, mail, hashedPassword, 'user', 1]
    );

    const userId = result.insertId;

    // Création de la session automatiquement
    const sessionToken = await createSession(userId);

    // Envoi du cookie avec le token
    const response = NextResponse.json({ message: 'Compte créé et utilisateur connecté', userId });
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1 heure
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 });
  }
}
