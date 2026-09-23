import { learningPath, missions } from "./content";
import type { GameProgress, GameSceneKey, ReadingMission, RuneProgress, ZoneProgress } from "./types";

const STORAGE_KEY = "dino-island-progress-v3";
const V2_STORAGE_KEY = "dino-island-progress-v2";
const LEGACY_STORAGE_KEY = "dino-island-progress-v1";
const MAX_HISTORY = 100;
const LEGACY_MISSION_ALIASES: Record<string, string> = {
  "sounds-minti-01": "sounds-initial-m-01",
  "syllables-map-01": "syllables-map-order-01",
  "stories-sun-01": "stories-order-sun-01",
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function emptyZone(): ZoneProgress {
  return { encounters: 0, familiesSeen: [], contentSeen: [], mastery: 0 };
}

function emptyRune(): RuneProgress {
  return { fragments: 0, stage: "locked" };
}

function createInitialProgress(): GameProgress {
  return {
    version: 3,
    currentScene: "BirthScene",
    eggChoice: null,
    hatched: false,
    selectedMissionId: "sounds-initial-m-01",
    completedMissionIds: [],
    decorations: [],
    attempts: 0,
    attemptHistory: [],
    zones: Object.fromEntries(learningPath.map((stage) => [stage.id, emptyZone()])),
    runes: Object.fromEntries(learningPath.map((stage) => [stage.id, emptyRune()])),
  };
}

interface PreviousProgress {
  version?: number;
  currentScene?: GameSceneKey;
  eggChoice?: number | null;
  hatched?: boolean;
  selectedMissionId?: string;
  completedMissionIds?: string[];
  decorations?: string[] | number;
  attempts?: number;
  lessonCompleted?: boolean;
}

function masteredLegacyZone(missionId: string): ZoneProgress {
  return {
    encounters: 3,
    familiesSeen: ["legacy-practice", "legacy-review"],
    contentSeen: [missionId, `${missionId}-review`, `${missionId}-practice`],
    mastery: 1,
  };
}

function migratePreviousProgress(parsed: PreviousProgress): GameProgress {
  const progress = createInitialProgress();
  const previousMissionIds = Array.isArray(parsed.completedMissionIds)
    ? parsed.completedMissionIds
    : parsed.lessonCompleted ? ["letters-sol-01"] : [];
  const completedMissionIds = previousMissionIds.map((missionId) => LEGACY_MISSION_ALIASES[missionId] ?? missionId);
  const previousSelectedMissionId = parsed.selectedMissionId ?? (parsed.lessonCompleted ? "letters-sol-01" : progress.selectedMissionId);

  progress.currentScene = parsed.currentScene ?? progress.currentScene;
  progress.eggChoice = parsed.eggChoice ?? null;
  progress.hatched = parsed.hatched ?? false;
  progress.selectedMissionId = LEGACY_MISSION_ALIASES[previousSelectedMissionId] ?? previousSelectedMissionId;
  progress.completedMissionIds = completedMissionIds;
  progress.decorations = Array.isArray(parsed.decorations)
    ? parsed.decorations
    : (parsed.decorations ?? 0) > 0 ? ["sun"] : [];
  progress.attempts = parsed.attempts ?? 0;

  learningPath.forEach((stage) => {
    const completedMission = missions.find((mission) => mission.stageId === stage.id && completedMissionIds.includes(mission.id));
    if (!completedMission) return;
    progress.zones[stage.id] = masteredLegacyZone(completedMission.id);
    progress.runes[stage.id] = { fragments: 3, stage: "radiant" };
  });
  return progress;
}

function normalizeProgress(parsed: Partial<GameProgress>): GameProgress {
  const initial = createInitialProgress();
  const zones = { ...initial.zones };
  const runes = { ...initial.runes };
  learningPath.forEach((stage) => {
    const zone = parsed.zones?.[stage.id];
    const rune = parsed.runes?.[stage.id];
    zones[stage.id] = zone
      ? {
          encounters: Number.isFinite(zone.encounters) ? Math.max(0, zone.encounters) : 0,
          familiesSeen: Array.isArray(zone.familiesSeen) ? zone.familiesSeen : [],
          contentSeen: Array.isArray(zone.contentSeen) ? zone.contentSeen : [],
          mastery: Number.isFinite(zone.mastery) ? clamp(zone.mastery, 0, 1) : 0,
        }
      : emptyZone();
    runes[stage.id] = rune
      ? { fragments: clamp(rune.fragments ?? 0, 0, 3), stage: rune.stage ?? "locked" }
      : emptyRune();
  });
  return {
    ...initial,
    ...parsed,
    version: 3,
    completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
    decorations: Array.isArray(parsed.decorations) ? parsed.decorations : [],
    attemptHistory: Array.isArray(parsed.attemptHistory) ? parsed.attemptHistory.slice(-MAX_HISTORY) : [],
    zones,
    runes,
  };
}

function saveProgress(progress: GameProgress): GameProgress {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeProgress(JSON.parse(stored) as Partial<GameProgress>);

    const previousStored = localStorage.getItem(V2_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!previousStored) return createInitialProgress();
    return saveProgress(migratePreviousProgress(JSON.parse(previousStored) as PreviousProgress));
  } catch {
    return createInitialProgress();
  }
}

export function updateProgress(update: Partial<GameProgress>): GameProgress {
  return saveProgress(normalizeProgress({ ...getProgress(), ...update, version: 3 }));
}

export function setCurrentScene(currentScene: GameSceneKey): void {
  updateProgress({ currentScene });
}

export function recordActivityAttempt(mission: ReadingMission, correct: boolean, helpLevel: number): GameProgress {
  const progress = getProgress();
  const attempt = {
    activityId: mission.id,
    stageId: mission.stageId,
    family: mission.family,
    contentTag: mission.contentTag,
    correct,
    helpLevel,
    completedAt: new Date().toISOString(),
  };
  const attemptHistory = [...progress.attemptHistory, attempt].slice(-MAX_HISTORY);
  if (!correct) return updateProgress({ attempts: progress.attempts + 1, attemptHistory });

  const previousZone = progress.zones[mission.stageId] ?? emptyZone();
  const familiesSeen = Array.from(new Set([...previousZone.familiesSeen, mission.family]));
  const contentSeen = Array.from(new Set([...previousZone.contentSeen, mission.contentTag]));
  const encounters = previousZone.encounters + 1;
  const mastered = encounters >= 3 && familiesSeen.length >= 2 && contentSeen.length >= 3;
  const mastery = mastered
    ? 1
    : Math.min(0.95, (Math.min(encounters, 3) / 3 + Math.min(familiesSeen.length, 2) / 2 + Math.min(contentSeen.length, 3) / 3) / 3);
  const fragments = Math.min(3, contentSeen.length);
  const runeStage = fragments === 0 ? "locked" : fragments === 1 ? "fragment" : fragments === 2 ? "awakened" : "radiant";

  return updateProgress({
    attempts: progress.attempts + 1,
    attemptHistory,
    completedMissionIds: Array.from(new Set([...progress.completedMissionIds, mission.id])),
    decorations: Array.from(new Set([...progress.decorations, mission.reward.id])),
    zones: {
      ...progress.zones,
      [mission.stageId]: { encounters, familiesSeen, contentSeen, mastery },
    },
    runes: {
      ...progress.runes,
      [mission.stageId]: { fragments, stage: runeStage },
    },
  });
}

export function isZoneMastered(progress: GameProgress, stageId: string): boolean {
  return (progress.zones[stageId]?.mastery ?? 0) >= 1;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(V2_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
