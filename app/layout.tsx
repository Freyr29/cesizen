import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import InactivityHandler from '@/components/InactivityHandler'; // Importer le composant InactivityHandler

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CESIZen - Votre bien-être au quotidien',
  description: 'Application de gestion du stress et du bien-être',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <InactivityHandler /> {/* Ajouter InactivityHandler ici */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
