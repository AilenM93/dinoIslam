export type GameSceneKey = "BirthScene" | "MapScene" | "ReadingScene" | "RefugeScene";

export interface GameProgress {
  version: 1;
  currentScene: GameSceneKey;
  eggChoice: number | null;
  hatched: boolean;
  lessonCompleted: boolean;
  decorations: number;
  attempts: number;
}

export interface ReadingMission {
  id: string;
  area: string;
  title: string;
  targetWord: string;
  prompt: string;
  spokenPrompt: string;
  choices: string[];
  answer: string;
  hint: string;
  success: string;
  retry: string;
}
