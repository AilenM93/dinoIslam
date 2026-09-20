import Phaser from "phaser";
import "./style.css";
import { BootScene } from "./game/scenes/BootScene";
import { BirthScene } from "./game/scenes/BirthScene";
import { MapScene } from "./game/scenes/MapScene";
import { ReadingScene } from "./game/scenes/ReadingScene";
import { RefugeScene } from "./game/scenes/RefugeScene";
import { isReducedMotion, isSoundEnabled, setReducedMotion, setSoundEnabled, unlockAudio } from "./game/settings";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#173f38",
  render: { antialias: true, pixelArt: false, roundPixels: false },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
  },
  scene: [BootScene, BirthScene, MapScene, ReadingScene, RefugeScene],
});

const soundButton = document.querySelector<HTMLButtonElement>("#sound-toggle");
const motionButton = document.querySelector<HTMLButtonElement>("#motion-toggle");

function updateControls(): void {
  const sound = isSoundEnabled();
  const reduced = isReducedMotion();
  if (soundButton) {
    soundButton.setAttribute("aria-pressed", String(sound));
    soundButton.textContent = sound ? "🔊 Sonido" : "🔇 Sonido";
    soundButton.title = sound ? "Desactivar ayuda hablada" : "Activar ayuda hablada";
  }
  if (motionButton) {
    motionButton.setAttribute("aria-pressed", String(!reduced));
    motionButton.textContent = reduced ? "🍃 Movimiento" : "🌿 Movimiento";
    motionButton.title = reduced ? "Activar movimiento" : "Reducir movimiento";
  }
  document.body.classList.toggle("reduce-motion", reduced);
}

soundButton?.addEventListener("click", () => {
  unlockAudio();
  setSoundEnabled(!isSoundEnabled());
  updateControls();
});

motionButton?.addEventListener("click", () => {
  setReducedMotion(!isReducedMotion());
  updateControls();
  const activeScene = game.scene.getScenes(true)[0];
  activeScene?.tweens.killAll();
  activeScene?.scene.restart();
});

window.addEventListener("pointerdown", unlockAudio, { once: true });
updateControls();
