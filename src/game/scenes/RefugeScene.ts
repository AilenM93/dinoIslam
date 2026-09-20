import Phaser from "phaser";
import { getMission, missions } from "../content";
import { getProgress, resetProgress, setCurrentScene } from "../progress";
import { announce } from "../settings";
import type { ReadingMission } from "../types";
import { BaseScene, palette } from "../ui";

export class RefugeScene extends BaseScene {
  constructor() {
    super("RefugeScene");
  }

  create(): void {
    this.prepareScene("refuge", 0.04);
    setCurrentScene("RefugeScene");
    const progress = getProgress();
    const completedCount = progress.completedMissionIds.length;
    const selectedMission = getMission(progress.selectedMissionId);
    this.title("Refugio de logros", `${completedCount} de ${missions.length} piedras decoran tu hogar.`);
    const portrait = this.sceneHeight > this.sceneWidth;

    const dino = this.fitImage(
      this.add.image(portrait ? this.sceneWidth * 0.76 : this.sceneWidth * 0.82, portrait ? this.sceneHeight * 0.4 : this.sceneHeight * 0.48, "minti"),
      portrait ? this.sceneWidth * 0.44 : this.sceneWidth * 0.23,
      portrait ? this.sceneHeight * 0.29 : this.sceneHeight * 0.52,
    );
    this.idle(dino, 4);

    const status = this.add
      .text(this.sceneWidth / 2, portrait ? this.sceneHeight * 0.56 : this.sceneHeight * 0.65, completedCount > 0 ? "Toca una piedra para recordar su aventura." : "Completa una aventura y su piedra aparecerá aquí.", {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 17 : 21}px`,
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.78)",
        padding: { x: 14, y: 9 },
        align: "center",
        wordWrap: { width: this.sceneWidth - 36 },
      })
      .setOrigin(0.5)
      .setDepth(22);

    this.drawAchievementGarden(progress.decorations, status, portrait);

    const buttonY = this.sceneHeight - (portrait ? 72 : 62);
    const leftButtonX = portrait ? this.sceneWidth * 0.25 : 130;
    const rightButtonX = portrait ? this.sceneWidth * 0.75 : 350;
    this.button(leftButtonX, buttonY, "Mapa", () => {
      setCurrentScene("MapScene");
      this.scene.start("MapScene");
    }, { width: portrait ? 150 : 190, color: palette.mint, fontSize: portrait ? 20 : 22 });
    this.button(rightButtonX, buttonY, "Repetir", () => {
      setCurrentScene("ReadingScene");
      this.scene.start("ReadingScene");
    }, { width: portrait ? 150 : 190, color: palette.sun, fontSize: portrait ? 20 : 22 });

    const reset = this.add
      .text(this.sceneWidth - 18, portrait ? 198 : 74, "Borrar logros y comenzar de nuevo", {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 13 : 15}px`,
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.72)",
        padding: { x: 12, y: 9 },
      })
      .setOrigin(1, 0)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });
    reset.on("pointerup", () => {
      resetProgress();
      this.scene.start("BirthScene");
    });

    const message = completedCount > 0
      ? `Tus ${completedCount} piedras forman parte del refugio. La más reciente es la ${selectedMission.reward.name.toLowerCase()}.`
      : "El refugio está listo para guardar los recuerdos de tus aventuras.";
    this.time.delayedCall(350, () => this.say(message));
    announce(message);
  }

  private drawAchievementGarden(decorationIds: string[], status: Phaser.GameObjects.Text, portrait: boolean): void {
    const startX = portrait ? 42 : this.sceneWidth * 0.28;
    const endX = portrait ? this.sceneWidth - 42 : this.sceneWidth * 0.7;
    const gap = (endX - startX) / (missions.length - 1);
    const baseY = portrait ? this.sceneHeight * 0.68 : this.sceneHeight * 0.78;

    missions.forEach((mission, index) => {
      const x = startX + gap * index;
      const y = baseY + (index % 2 === 0 ? 0 : portrait ? 12 : 18);
      const moss = this.add.graphics().setDepth(8);
      moss.fillStyle(0x47784c, 0.86);
      moss.fillEllipse(x, y + 23, portrait ? 62 : 92, portrait ? 22 : 30);
      moss.fillStyle(0x76a95b, 0.72);
      moss.fillEllipse(x - 8, y + 18, portrait ? 36 : 56, portrait ? 14 : 19);
      if (decorationIds.includes(mission.reward.id)) this.drawRewardStone(x, y, mission, status, portrait);
    });
  }

  private drawRewardStone(x: number, y: number, mission: ReadingMission, status: Phaser.GameObjects.Text, portrait: boolean): void {
    const width = portrait ? 54 : 78;
    const height = portrait ? 43 : 60;
    const container = this.add.container(x, y).setDepth(12);
    const graphics = this.add.graphics();
    graphics.fillStyle(0x1e342f, 0.35);
    graphics.fillEllipse(3, 7, width + 5, height + 3);
    graphics.fillStyle(mission.reward.color, 1);
    graphics.fillEllipse(0, 0, width, height);
    graphics.lineStyle(portrait ? 3 : 4, mission.reward.accent, 0.95);
    graphics.strokeEllipse(0, 0, width, height);
    graphics.fillStyle(mission.reward.accent, 0.38);
    graphics.fillEllipse(-width * 0.16, -height * 0.2, width * 0.34, height * 0.2);
    const symbol = this.add
      .text(0, 0, mission.reward.symbol, {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 22 : 31}px`,
        fontStyle: "bold",
        color: "#173f38",
      })
      .setOrigin(0.5);
    container.add([graphics, symbol]);
    container.setSize(width + 10, height + 10).setInteractive({ useHandCursor: true });
    container.on("pointerover", () => container.setScale(1.08));
    container.on("pointerout", () => container.setScale(1));
    container.on("pointerup", () => {
      container.setScale(1);
      status.setText(`${mission.reward.name} · ${mission.area}`);
      this.say(`${mission.reward.name}, recuerdo de ${mission.area}.`);
      announce(`${mission.reward.name}, recuerdo de ${mission.area}.`);
    });
  }
}
