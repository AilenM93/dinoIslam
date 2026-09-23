import type { AttemptRecord, ReadingMission } from "./types";

export const learningPath = [
  { id: "sounds", name: "Nido de sonidos", focus: "Discriminación de sonidos del habla", icon: "👂" },
  { id: "letters", name: "Bosque de letras", focus: "Relación entre letras y sonidos", icon: "🌳" },
  { id: "syllables", name: "Puente de sílabas", focus: "Combinación de sílabas", icon: "🌉" },
  { id: "words", name: "Laguna de palabras", focus: "Lectura y significado de palabras", icon: "💧" },
  { id: "stories", name: "Cueva de cuentos", focus: "Frases e historias breves", icon: "📖" },
] as const;

const rewards = {
  sounds: { id: "echo", name: "Runa del eco", symbol: "〽", color: 0x4cc9e8, accent: 0xd8f7ff, assetKey: "rune-echo" },
  letters: { id: "sun", name: "Runa del brote", symbol: "☀", color: 0xffd85b, accent: 0xfff2a8, assetKey: "rune-sun" },
  syllables: { id: "bridge", name: "Runa del vínculo", symbol: "⌒", color: 0xff9b72, accent: 0xffd1bd, assetKey: "rune-bridge" },
  words: { id: "lagoon", name: "Runa de la corriente", symbol: "≈", color: 0x42b8ad, accent: 0xbef2e8, assetKey: "rune-lagoon" },
  stories: { id: "story", name: "Runa de la memoria", symbol: "✦", color: 0x9b7ede, accent: 0xe4d9ff, assetKey: "rune-story" },
} as const;

export const missions: ReadingMission[] = [
  {
    id: "sounds-initial-m-01", stageId: "sounds", family: "initial-sound", contentTag: "m",
    interaction: "choice", area: "Nido de sonidos", title: "El eco de Minti", icon: "👂", targetWord: "MINTI",
    prompt: "¿Qué palabra empieza como MINTI?", spokenPrompt: "Escucha: Minti. ¿Qué palabra empieza con el mismo sonido? Mesa, sol o pato.",
    choices: ["MESA", "SOL", "PATO"], answer: "MESA", hint: "Pista: MINTI y MESA empiezan con mmm.",
    success: "¡MINTI y MESA empiezan igual!", retry: "Casi. Escucha el comienzo: mmminti.", reward: rewards.sounds,
  },
  {
    id: "sounds-rhyme-cat-01", stageId: "sounds", family: "rhyme", contentTag: "gato-pato",
    interaction: "choice", area: "Nido de sonidos", title: "Rimas del nido", icon: "🎵", targetWord: "GATO",
    prompt: "¿Qué palabra suena parecida al final?", spokenPrompt: "Escucha: gato. ¿Qué palabra rima con gato? Pato, mesa o sol.",
    choices: ["MESA", "PATO", "SOL"], answer: "PATO", hint: "Pista: escucha el final: gato, pato.",
    success: "¡GATO y PATO riman!", retry: "Casi. Escucha otra vez el final de gato.", reward: rewards.sounds,
  },
  {
    id: "sounds-compare-m-01", stageId: "sounds", family: "sound-compare", contentTag: "mesa-mapa",
    interaction: "choice", area: "Nido de sonidos", title: "Dos sonidos curiosos", icon: "👂", targetWord: "MESA · MAPA",
    prompt: "¿Empiezan con el mismo sonido?", spokenPrompt: "Escucha: mesa, mapa. ¿Empiezan con el mismo sonido?",
    choices: ["DIFERENTES", "IGUALES"], answer: "IGUALES", hint: "Pista: mesa y mapa empiezan con mmm.",
    success: "¡Los dos empiezan con M!", retry: "Casi. Di despacio: mesa, mapa.", reward: rewards.sounds,
  },
  {
    id: "sounds-rhyme-match-01", stageId: "sounds", family: "rhyme-matching", contentTag: "three-rhymes",
    interaction: "matching", area: "Nido de sonidos", title: "Parejas de ecos", icon: "🎵", targetWord: "3 PAREJAS",
    prompt: "Une las palabras que riman.", spokenPrompt: "Busca las parejas que terminan con sonidos parecidos.",
    choices: [], answer: "all-matched", matchPairs: [
      { left: "GATO", right: "PATO" }, { left: "LUNA", right: "CUNA" }, { left: "RANA", right: "LANA" },
    ],
    hint: "Pista: escucha el final de cada palabra.", success: "¡Encontraste las tres parejas de ecos!",
    retry: "Esas palabras no riman. Escucha de nuevo sus finales.", reward: rewards.sounds,
  },
  {
    id: "letters-sol-01", stageId: "letters", family: "initial-letter", contentTag: "s-sol",
    interaction: "choice", area: "Bosque de letras", title: "La letra del sol", icon: "☀️", targetWord: "SOL",
    prompt: "¿Qué letra aparece al principio?", spokenPrompt: "Escucha: sol. ¿Qué letra aparece al principio de sol?",
    choices: ["M", "S", "P"], answer: "S", hint: "Pista: SOL y SOPA empiezan igual.",
    success: "¡SOL empieza con S!", retry: "Casi. Escucha otra vez: sol.", reward: rewards.letters,
  },
  {
    id: "letters-luna-01", stageId: "letters", family: "sound-letter", contentTag: "l-luna",
    interaction: "choice", area: "Bosque de letras", title: "La luna entre hojas", icon: "🌙", targetWord: "LUNA",
    prompt: "Encuentra la letra que suena lll.", spokenPrompt: "Luna empieza con lll. Encuentra su letra.",
    choices: ["T", "P", "L"], answer: "L", hint: "Pista: pasa la lengua detrás de los dientes: lll.",
    success: "¡Encontraste la L de LUNA!", retry: "Casi. Escucha: llluna.", reward: rewards.letters,
  },
  {
    id: "letters-b-visual-01", stageId: "letters", family: "visual-discrimination", contentTag: "b-d-p",
    interaction: "choice", area: "Bosque de letras", title: "Hojas parecidas", icon: "🌿", targetWord: "B",
    prompt: "¿Cuál es otra letra B?", spokenPrompt: "Mira la letra be. Encuentra otra igual.",
    choices: ["D", "P", "B"], answer: "B", hint: "Pista: mira hacia qué lado está su barriga.",
    success: "¡Es la misma letra B!", retry: "Casi. Compara la forma con calma.", reward: rewards.letters,
  },
  {
    id: "letters-picture-match-01", stageId: "letters", family: "picture-letter-matching", contentTag: "three-initials",
    interaction: "matching", area: "Bosque de letras", title: "Semillas de letras", icon: "🌱", targetWord: "3 PAREJAS",
    prompt: "Une cada dibujo con su letra inicial.", spokenPrompt: "Une sol con ese, luna con ele y oso con o.",
    choices: [], answer: "all-matched", matchPairs: [
      { left: "☀️ SOL", right: "S" }, { left: "🌙 LUNA", right: "L" }, { left: "🐻 OSO", right: "O" },
    ],
    hint: "Pista: di el nombre del dibujo y escucha su comienzo.", success: "¡Cada dibujo encontró su letra!",
    retry: "Esa letra no inicia el dibujo. Escucha su primera voz.", reward: rewards.letters,
  },
  {
    id: "syllables-map-order-01", stageId: "syllables", family: "syllable-order", contentTag: "ma-pa",
    interaction: "sequence", area: "Puente de sílabas", title: "El mapa partido", icon: "🗺️", targetWord: "MAPA",
    prompt: "Toca las partes en orden para formar MAPA.", spokenPrompt: "Construye mapa. Toca primero ma y después pa.",
    choices: ["PA", "MA"], answer: "MA PA", sequenceAnswer: ["MA", "PA"], hint: "Pista: empieza igual que mano: MA.",
    success: "¡MA y PA forman MAPA!", retry: "Casi. Vuelve a empezar: MA, PA.", reward: rewards.syllables,
  },
  {
    id: "syllables-count-house-01", stageId: "syllables", family: "syllable-count", contentTag: "ca-sa",
    interaction: "choice", area: "Puente de sílabas", title: "Pasos sobre el puente", icon: "👏", targetWord: "CA · SA",
    prompt: "¿Cuántos golpes tiene CASA?", spokenPrompt: "Aplaude conmigo: ca, sa. ¿Cuántos golpes escuchaste?",
    choices: ["3", "1", "2"], answer: "2", hint: "Pista: da una palmada por cada parte: CA, SA.",
    success: "¡CASA tiene dos partes!", retry: "Casi. Prueba con palmas: CA, SA.", reward: rewards.syllables,
  },
  {
    id: "syllables-soup-01", stageId: "syllables", family: "syllable-blend", contentTag: "so-pa",
    interaction: "choice", area: "Puente de sílabas", title: "Piezas que se unen", icon: "🥣", targetWord: "SO + PA",
    prompt: "¿Qué palabra forman las piezas?", spokenPrompt: "Une so y pa. ¿Qué palabra forman?",
    choices: ["SOPA", "SAPO", "PASA"], answer: "SOPA", hint: "Pista: di las partes sin pausa: sopa.",
    success: "¡SO y PA forman SOPA!", retry: "Casi. Acerca las dos partes: SO, PA.", reward: rewards.syllables,
  },
  {
    id: "syllables-pair-build-01", stageId: "syllables", family: "syllable-matching", contentTag: "three-built-words",
    interaction: "matching", area: "Puente de sílabas", title: "Puentes de palabras", icon: "🌉", targetWord: "3 PUENTES",
    prompt: "Une las sílabas con la palabra que forman.", spokenPrompt: "Une cada par de sílabas con su palabra completa.",
    choices: [], answer: "all-matched", matchPairs: [
      { left: "MA + PA", right: "MAPA" }, { left: "SO + PA", right: "SOPA" }, { left: "CA + SA", right: "CASA" },
    ],
    hint: "Pista: pronuncia las dos partes sin dejar espacio.", success: "¡Construiste tres puentes de palabras!",
    retry: "Esas piezas no forman esa palabra. Júntalas despacio.", reward: rewards.syllables,
  },
  {
    id: "words-sun-01", stageId: "words", family: "image-word", contentTag: "sun",
    interaction: "choice", area: "Laguna de palabras", title: "El reflejo dorado", icon: "☀️", targetWord: "",
    prompt: "¿Qué palabra nombra el dibujo?", spokenPrompt: "Mira el dibujo del sol. ¿Qué palabra lo nombra?",
    choices: ["MAR", "SOL", "PAN"], answer: "SOL", hint: "Pista: empieza con S y brilla en el cielo.",
    success: "¡El dibujo representa el SOL!", retry: "Casi. Busca la palabra que empieza con S.", reward: rewards.words,
  },
  {
    id: "words-complete-sea-01", stageId: "words", family: "word-completion", contentTag: "mar",
    interaction: "choice", area: "Laguna de palabras", title: "La letra que falta", icon: "🌊", targetWord: "M _ R",
    prompt: "¿Qué letra completa MAR?", spokenPrompt: "Completa la palabra mar. M, espacio, erre. ¿Qué letra falta?",
    choices: ["O", "A", "E"], answer: "A", hint: "Pista: escucha despacio: mmmar.",
    success: "¡M, A, R forma MAR!", retry: "Casi. Escucha la vocal de MAR.", reward: rewards.words,
  },
  {
    id: "words-odd-one-01", stageId: "words", family: "meaning", contentTag: "animals-table",
    interaction: "choice", area: "Laguna de palabras", title: "La palabra intrusa", icon: "🐾", targetWord: "GATO · PATO · MESA",
    prompt: "¿Cuál palabra no es un animal?", spokenPrompt: "Gato, pato, mesa. ¿Cuál no es un animal?",
    choices: ["GATO", "MESA", "PATO"], answer: "MESA", hint: "Pista: una sirve para apoyar cosas.",
    success: "¡MESA no es un animal!", retry: "Casi. Imagina cada palabra.", reward: rewards.words,
  },
  {
    id: "words-picture-match-01", stageId: "words", family: "picture-word-matching", contentTag: "three-picture-words",
    interaction: "matching", area: "Laguna de palabras", title: "Reflejos con nombre", icon: "💧", targetWord: "3 REFLEJOS",
    prompt: "Une cada dibujo con su palabra.", spokenPrompt: "Une cada dibujo con la palabra que lo nombra.",
    choices: [], answer: "all-matched", matchPairs: [
      { left: "☀️", right: "SOL" }, { left: "🌊", right: "MAR" }, { left: "🍞", right: "PAN" },
    ],
    hint: "Pista: nombra el dibujo en voz alta y busca esa palabra.", success: "¡Los tres reflejos tienen nombre!",
    retry: "Esa palabra nombra otro dibujo. Prueba otra pareja.", reward: rewards.words,
  },
  {
    id: "stories-order-sun-01", stageId: "stories", family: "sentence-order", contentTag: "sun-rises",
    interaction: "sequence", area: "Cueva de cuentos", title: "La frase escondida", icon: "🌅", targetWord: "",
    prompt: "Ordena las palabras para contar lo que pasa.", spokenPrompt: "Ordena la frase. Toca: sale, el, sol.",
    choices: ["SOL", "SALE", "EL"], answer: "SALE EL SOL", sequenceAnswer: ["SALE", "EL", "SOL"], hint: "Pista: empieza con la acción: SALE.",
    success: "¡La historia dice: SALE EL SOL!", retry: "Casi. Empieza por lo que sucede: SALE.", reward: rewards.stories,
  },
  {
    id: "stories-comprehension-01", stageId: "stories", family: "literal-comprehension", contentTag: "minti-water",
    interaction: "choice", area: "Cueva de cuentos", title: "La sed de Minti", icon: "📖", targetWord: "MINTI TIENE SED.",
    prompt: "¿Qué debería buscar Minti?", spokenPrompt: "Minti tiene sed. ¿Qué debería buscar? Agua, una piedra o una hoja.",
    choices: ["PIEDRA", "AGUA", "HOJA"], answer: "AGUA", hint: "Pista: pensamos qué necesita alguien con sed.",
    success: "¡Minti busca AGUA!", retry: "Casi. ¿Qué tomamos cuando tenemos sed?", reward: rewards.stories,
  },
  {
    id: "stories-ending-01", stageId: "stories", family: "story-completion", contentTag: "nest-sleep",
    interaction: "choice", area: "Cueva de cuentos", title: "Un final tranquilo", icon: "🌙", targetWord: "LLEGA LA NOCHE…",
    prompt: "¿Qué final tiene más sentido?", spokenPrompt: "Llega la noche. ¿Qué hace Minti? Va al nido, al cielo o a una piedra.",
    choices: ["PIEDRA", "NIDO", "CIELO"], answer: "NIDO",
    hint: "Pista: piensa qué hacemos al llegar la noche.", success: "¡Minti duerme en su nido!", retry: "Casi. Busca un final posible y tranquilo.", reward: rewards.stories,
  },
  {
    id: "stories-event-match-01", stageId: "stories", family: "event-matching", contentTag: "three-causes",
    interaction: "matching", area: "Cueva de cuentos", title: "Ecos de la historia", icon: "📖", targetWord: "3 MOMENTOS",
    prompt: "Une cada momento con lo que sucede después.", spokenPrompt: "Une cada comienzo con una continuación que tenga sentido.",
    choices: [], answer: "all-matched", matchPairs: [
      { left: "TIENE SED", right: "BEBE AGUA" }, { left: "LLEGA LA NOCHE", right: "VA AL NIDO" }, { left: "SALE EL SOL", right: "EMPIEZA EL DÍA" },
    ],
    hint: "Pista: imagina qué pasaría después en cada momento.", success: "¡Conectaste los tres momentos de la historia!",
    retry: "Esa continuación no encaja. Imagina la escena completa.", reward: rewards.stories,
  },
];

export const firstMission = missions[0];

export function getMission(missionId: string): ReadingMission {
  return missions.find((mission) => mission.id === missionId) ?? firstMission;
}

export function getMissionsForStage(stageId: string): ReadingMission[] {
  return missions.filter((mission) => mission.stageId === stageId);
}

export function selectMissionForStage(stageId: string, history: AttemptRecord[]): ReadingMission {
  const stageMissions = getMissionsForStage(stageId);
  if (stageMissions.length === 0) return firstMission;
  const lastActivityId = [...history].reverse().find((attempt) => attempt.stageId === stageId)?.activityId;
  const eligible = stageMissions.filter((mission) => mission.id !== lastActivityId);
  const pool = eligible.length > 0 ? eligible : stageMissions;
  const counts = new Map<string, number>();
  history.forEach((attempt) => counts.set(attempt.activityId, (counts.get(attempt.activityId) ?? 0) + 1));
  const leastSeen = Math.min(...pool.map((mission) => counts.get(mission.id) ?? 0));
  const balanced = pool.filter((mission) => (counts.get(mission.id) ?? 0) === leastSeen);
  return balanced[Math.floor(Math.random() * balanced.length)] ?? pool[0];
}
