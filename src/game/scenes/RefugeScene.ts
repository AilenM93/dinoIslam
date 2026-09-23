import Phaser from "phaser";
import { typography } from "../typography";
import { getMission, getMissionsForStage, learningPath, selectMissionForStage } from "../content";
import { getProgress, resetProgress, setCurrentScene, updateProgress } from "../progress";
import { announce } from "../settings";
import type { GameProgress } from "../types";
import { BaseScene, palette } from "../ui";

export class RefugeScene extends BaseScene {
  constructor() {
    super("RefugeScene");
  }

  create(): void {
    this.prepareScene("refuge-v2", 0.02);
    setCurrentScene("RefugeScene");
    const progress = getProgress();
    const radiantCount = learningPath.filter((stage) => progress.runes[stage.id]?.stage === "radiant").length;
    const fragmentCount = learningPath.reduce((total, stage) => total + (progress.runes[stage.id]?.fragments ?? 0), 0);
    const selectedMission = getMission(progress.selectedMissionId);
    const portrait = this.sceneHeight > this.sceneWidth;

    this.createRuneHeader(radiantCount, fragmentCount, portrait);

    const dino = this.fitImage(
      this.add.image(portrait ? this.sceneWidth * 0.76 : this.sceneWidth * 0.82, portrait ? this.sceneHeight * 0.46 : this.sceneHeight * 0.53, "minti-rest"),
      portrait ? this.sceneWidth * 0.44 : this.sceneWidth * 0.25,
      portrait ? this.sceneHeight * 0.2 : this.sceneHeight * 0.28,
    ).setDepth(7);
    this.breathe(dino);

    const status = this.add
      .text(this.sceneWidth / 2, portrait ? this.sceneHeight * 0.57 : this.sceneHeight * 0.66, fragmentCount > 0 ? "Toca una runa para conocer su historia." : "Explora el Nido de sonidos para encontrar tu primera runa.", {
        fontFamily: typography.body,
        fontSize: `${portrait ? 17 : 21}px`,
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.82)",
        padding: { x: 14, y: 9 },
        align: "center",
        wordWrap: { width: this.sceneWidth - 36 },
      })
      .setOrigin(0.5)
      .setDepth(22);

    this.drawRuneCollection(progress, status, portrait);

    const buttonY = this.sceneHeight - (portrait ? 66 : 58);
    const leftButtonX = portrait ? this.sceneWidth * 0.25 : 135;
    const rightButtonX = portrait ? this.sceneWidth * 0.75 : 385;
    this.button(leftButtonX, buttonY, "Mapa", () => {
      setCurrentScene("MapScene");
      this.scene.start("MapScene");
    }, { width: portrait ? 150 : 190, color: palette.mint, fontSize: portrait ? 20 : 22 });
    this.button(rightButtonX, buttonY, "Otra aventura", () => {
      const current = getProgress();
      const nextMission = selectMissionForStage(selectedMission.stageId, current.attemptHistory);
      updateProgress({ selectedMissionId: nextMission.id });
      setCurrentScene("ReadingScene");
      this.scene.start("ReadingScene");
    }, { width: portrait ? 178 : 220, color: palette.sun, fontSize: portrait ? 17 : 20 });

    this.createProtectedReset(portrait);

    const message = fragmentCount > 0
      ? `Tu colección tiene ${fragmentCount} fragmentos. Sigue explorando para volver radiantes las cinco runas.`
      : "El refugio está listo para guardar las runas de tus aventuras.";
    this.time.delayedCall(350, () => this.say(message));
    announce(message);
  }

  private createRuneHeader(radiantCount: number, fragmentCount: number, portrait: boolean): void {
    const sign = this.fitImage(
      this.add.image(this.sceneWidth / 2, portrait ? 90 : 82, "ui-wood-sign"),
      Math.min(this.sceneWidth - 24, portrait ? 370 : 600),
      portrait ? 130 : 150,
    ).setDepth(15);
    this.add
      .text(sign.x, sign.y - (portrait ? 13 : 17), "RUNAS DE LA ISLA", {
        fontFamily: typography.display,
        fontSize: `${portrait ? 25 : 34}px`,
        fontStyle: "bold",
        color: "#173f38",
      })
      .setOrigin(0.5)
      .setDepth(16);
    this.add
      .text(sign.x, sign.y + (portrait ? 22 : 25), `${radiantCount} radiantes · ${fragmentCount} fragmentos`, {
        fontFamily: typography.body,
        fontSize: `${portrait ? 14 : 18}px`,
        fontStyle: "bold",
        color: "#315f45",
      })
      .setOrigin(0.5)
      .setDepth(16);
  }

  private drawRuneCollection(progress: GameProgress, status: Phaser.GameObjects.Text, portrait: boolean): void {
    const startX = portrait ? 42 : this.sceneWidth * 0.2;
    const endX = portrait ? this.sceneWidth - 42 : this.sceneWidth * 0.71;
    const gap = (endX - startX) / (learningPath.length - 1);
    const baseY = portrait ? this.sceneHeight * 0.72 : this.sceneHeight * 0.8;

    learningPath.forEach((stage, index) => {
      const mission = getMissionsForStage(stage.id)[0];
      if (!mission) return;
      const rune = progress.runes[stage.id];
      const x = startX + gap * index;
      const y = baseY + (index % 2 === 0 ? 0 : portrait ? 12 : 18);
      const width = portrait ? 64 : 105;
      const height = portrait ? 58 : 92;
      const pedestal = this.add.ellipse(x, y + height * 0.36, width * 0.92, height * 0.3, 0x315f45, 0.72).setDepth(8);
      pedestal.setStrokeStyle(2, 0x9bd46f, 0.7);

      if (!rune || rune.fragments === 0) {
        this.add
          .text(x, y - 3, "?", {
            fontFamily: typography.body,
            fontSize: `${portrait ? 28 : 38}px`,
            fontStyle: "bold",
            color: "#d6e3c5",
          })
          .setOrigin(0.5)
          .setDepth(10)
          .setAlpha(0.72);
        this.drawFragmentDots(x, y + height * 0.59, 0, portrait);
        return;
      }

      const image = this.fitImage(this.add.image(x, y, mission.reward.assetKey), width, height).setDepth(12);
      image.setAlpha(rune.stage === "fragment" ? 0.58 : rune.stage === "awakened" ? 0.8 : 1);
      if (rune.stage === "radiant") {
        const glow = this.add.ellipse(x, y, width * 0.9, height * 0.8, mission.reward.accent, 0.18).setDepth(11);
        if (!this.anims.paused) this.tweens.add({ targets: glow, alpha: { from: 0.08, to: 0.32 }, duration: 1200, yoyo: true, repeat: -1 });
      }
      image.setInteractive({ useHandCursor: true });
      image.on("pointerover", () => image.setScale(image.scaleX * 1.06, image.scaleY * 1.06));
      image.on("pointerout", () => this.fitImage(image, width, height));
      image.on("pointerup", () => {
        this.fitImage(image, width, height);
        const stageLabel = rune.stage === "radiant" ? "radiante" : `${rune.fragments} de 3 fragmentos`;
        status.setText(`${mission.reward.name} · ${stageLabel}`);
        this.say(`${mission.reward.name}. ${stageLabel}. Recuerdo de ${mission.area}.`);
        announce(`${mission.reward.name}. ${stageLabel}.`);
      });
      this.drawFragmentDots(x, y + height * 0.59, rune.fragments, portrait);
    });
  }

  private drawFragmentDots(x: number, y: number, fragments: number, portrait: boolean): void {
    const spacing = portrait ? 12 : 17;
    for (let index = 0; index < 3; index += 1) {
      const dot = this.add.circle(x + (index - 1) * spacing, y, portrait ? 4 : 5, index < fragments ? palette.sun : 0x264c44, 0.96).setDepth(15);
      dot.setStrokeStyle(1.5, palette.cream, 0.9);
    }
  }

  private createProtectedReset(portrait: boolean): void {
    let armed = false;
    let disarmTimer: Phaser.Time.TimerEvent | undefined;
    const reset = this.add
      .text(this.sceneWidth - 18, portrait ? 176 : 28, "Opciones familiares", {
        fontFamily: typography.body,
        fontSize: `${portrait ? 13 : 15}px`,
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.78)",
        padding: { x: 12, y: 9 },
      })
      .setOrigin(1, 0)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });
    reset.on("pointerup", () => {
      if (!armed) {
        armed = true;
        reset.setText("Toca otra vez para borrar logros").setBackgroundColor("rgba(122,55,42,0.9)");
        disarmTimer?.remove();
        disarmTimer = this.time.delayedCall(4500, () => {
          armed = false;
          reset.setText("Opciones familiares").setBackgroundColor("rgba(19,63,56,0.78)");
        });
        return;
      }
      resetProgress();
      this.scene.start("BirthScene");
    });
  }
}
