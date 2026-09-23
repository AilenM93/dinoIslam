export type GameSceneKey = "BirthScene" | "MapScene" | "ReadingScene" | "RefugeScene";

export type ActivityInteraction = "choice" | "sequence" | "matching";
export type RuneStage = "locked" | "fragment" | "awakened" | "radiant";

export interface AttemptRecord {
  activityId: string;
  stageId: string;
  family: string;
  contentTag: string;
  correct: boolean;
  helpLevel: number;
  completedAt: string;
}

export interface ZoneProgress {
  encounters: number;
  familiesSeen: string[];
  contentSeen: string[];
  mastery: number;
}

export interface RuneProgress {
  fragments: number;
  stage: RuneStage;
}

export interface GameProgress {
  version: 3;
  currentScene: GameSceneKey;
  eggChoice: number | null;
  hatched: boolean;
  selectedMissionId: string;
  completedMissionIds: string[];
  decorations: string[];
  attempts: number;
  attemptHistory: AttemptRecord[];
  zones: Record<string, ZoneProgress>;
  runes: Record<string, RuneProgress>;
}

export interface ReadingMission {
  id: string;
  stageId: string;
  family: string;
  contentTag: string;
  interaction: ActivityInteraction;
  area: string;
  title: string;
  icon: string;
  targetWord: string;
  prompt: string;
  spokenPrompt: string;
  choices: string[];
  answer: string;
  sequenceAnswer?: string[];
  matchPairs?: Array<{
    left: string;
    right: string;
  }>;
  hint: string;
  success: string;
  retry: string;
  reward: {
    id: string;
    name: string;
    symbol: string;
    color: number;
    accent: number;
    assetKey: string;
  };
}
