import type { GameProgress, GameSceneKey } from "./types";

const STORAGE_KEY = "dino-island-progress-v2";
const LEGACY_STORAGE_KEY = "dino-island-progress-v1";

const initialProgress: GameProgress = {
  version: 2,
  currentScene: "BirthScene",
  eggChoice: null,
  hatched: false,
  selectedMissionId: "letters-sol-01",
  completedMissionIds: [],
  decorations: [],
  attempts: 0,
};

interface LegacyProgress {
  version?: number;
  currentScene?: GameSceneKey;
  eggChoice?: number | null;
  hatched?: boolean;
  lessonCompleted?: boolean;
  decorations?: number;
  attempts?: number;
}

function migrateLegacyProgress(parsed: LegacyProgress): GameProgress {
  const completed = parsed.lessonCompleted ? ["letters-sol-01"] : [];
  const decorations = (parsed.decorations ?? 0) > 0 ? ["sun"] : [];
  return {
    ...initialProgress,
    currentScene: parsed.currentScene ?? initialProgress.currentScene,
    eggChoice: parsed.eggChoice ?? null,
    hatched: parsed.hatched ?? false,
    completedMissionIds: completed,
    decorations,
    attempts: parsed.attempts ?? 0,
  };
}

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<GameProgress>;
      if (parsed.version === 2) {
        return {
          ...initialProgress,
          ...parsed,
          completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
          decorations: Array.isArray(parsed.decorations) ? parsed.decorations : [],
        };
      }
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyStored) return { ...initialProgress };
    const migrated = migrateLegacyProgress(JSON.parse(legacyStored) as LegacyProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return { ...initialProgress };
  }
}

export function updateProgress(update: Partial<GameProgress>): GameProgress {
  const next = { ...getProgress(), ...update, version: 2 as const };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function setCurrentScene(currentScene: GameSceneKey): void {
  updateProgress({ currentScene });
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
