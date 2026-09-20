import type { ReadingMission } from "./types";

export const learningPath = [
  { id: "sounds", name: "Nido de sonidos", focus: "Discriminación de sonidos del habla" },
  { id: "letters", name: "Bosque de letras", focus: "Relación entre letras y sonidos" },
  { id: "syllables", name: "Puente de sílabas", focus: "Combinación de sílabas" },
  { id: "words", name: "Laguna de palabras", focus: "Lectura y significado de palabras" },
  { id: "stories", name: "Cueva de cuentos", focus: "Frases e historias breves" },
] as const;

export const firstMission: ReadingMission = {
  id: "letters-sol-01",
  area: "Bosque de letras",
  title: "La piedra del sol",
  targetWord: "SOL",
  prompt: "¿Qué letra aparece al principio?",
  spokenPrompt: "Escucha: sol. ¿Qué letra aparece al principio de sol?",
  choices: ["M", "S", "P"],
  answer: "S",
  hint: "Pista: SOL y SOPA empiezan igual.",
  success: "¡Lo encontraste! SOL empieza así.",
  retry: "Casi. Escucha otra vez: sol.",
};
