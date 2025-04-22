// Définition du type Activity
interface Activity {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
}