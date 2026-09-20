export type GameSceneKey = "BirthScene" | "MapScene" | "ReadingScene" | "RefugeScene";

export interface GameProgress {
  version: 2;
  currentScene: GameSceneKey;
  eggChoice: number | null;
  hatched: boolean;
  selectedMissionId: string;
  completedMissionIds: string[];
  decorations: string[];
  attempts: number;
}

export interface ReadingMission {
  id: string;
  stageId: string;
  area: string;
  title: string;
  icon: string;
  targetWord: string;
  prompt: string;
  spokenPrompt: string;
  choices: string[];
  answer: string;
  hint: string;
  success: string;
  retry: string;
  reward: {
    id: string;
    name: string;
    symbol: string;
    color: number;
    accent: number;
  };
}
