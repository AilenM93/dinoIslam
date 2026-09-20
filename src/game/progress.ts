import type { GameProgress, GameSceneKey } from "./types";

const STORAGE_KEY = "dino-island-progress-v1";

const initialProgress: GameProgress = {
  version: 1,
  currentScene: "BirthScene",
  eggChoice: null,
  hatched: false,
  lessonCompleted: false,
  decorations: 0,
  attempts: 0,
};

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...initialProgress };
    const parsed = JSON.parse(stored) as Partial<GameProgress>;
    if (parsed.version !== 1) return { ...initialProgress };
    return { ...initialProgress, ...parsed };
  } catch {
    return { ...initialProgress };
  }
}

export function updateProgress(update: Partial<GameProgress>): GameProgress {
  const next = { ...getProgress(), ...update, version: 1 as const };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function setCurrentScene(currentScene: GameSceneKey): void {
  updateProgress({ currentScene });
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
