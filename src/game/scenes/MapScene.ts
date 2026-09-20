import { learningPath, missions } from "../content";
import { getProgress, setCurrentScene, updateProgress } from "../progress";
import { announce, isReducedMotion } from "../settings";
import { BaseScene, palette } from "../ui";

export class MapScene extends BaseScene {
  constructor() {
    super("MapScene");
  }

  create(): void {
    this.prepareScene("island", 0.04);
    setCurrentScene("MapScene");
    const progress = getProgress();
    this.title("Explora la isla", "Todas las aventuras están abiertas. Elige por dónde continuar.");
    const portrait = this.sceneHeight > this.sceneWidth;
    if (!portrait) {
      const dino = this.fitImage(
        this.add.image(this.sceneWidth * 0.11, this.sceneHeight * 0.79, "minti"),
        220,
        300,
      );
      this.idle(dino, 5);
    }

    const nodes = portrait
      ? [
          [0.25, 0.69],
          [0.5, 0.49],
          [0.75, 0.69],
          [0.75, 0.29],
          [0.25, 0.29],
        ]
      : [
          [0.23, 0.72],
          [0.41, 0.46],
          [0.58, 0.64],
          [0.72, 0.46],
          [0.82, 0.28],
        ];

    learningPath.forEach((stage, index) => {
      const [x, y] = nodes[index];
      const mission = missions.find((item) => item.stageId === stage.id);
      if (!mission) return;
      this.adventureMarker(
        x * this.sceneWidth,
        y * this.sceneHeight,
        stage.name,
        stage.icon,
        mission.id,
        progress.completedMissionIds.includes(mission.id),
        index,
      );
    });
    this.button(this.sceneWidth - Math.min(122, this.sceneWidth * 0.24), this.sceneHeight - 40, "↺ Nacimiento", () => {
      this.scene.start("BirthScene", { replayIntro: true });
    }, {
      width: Math.min(220, this.sceneWidth * 0.44),
      color: palette.cream,
      fontSize: this.sceneWidth < 520 ? 16 : 19,
      depth: 12,
    });
    announce(`Mapa de Dino Island. Hay cinco aventuras disponibles y ${progress.completedMissionIds.length} completadas.`);
  }

  private adventureMarker(x: number, y: number, label: string, icon: string, missionId: string, completed: boolean, index: number): void {
    const colors = [palette.ocean, palette.mint, palette.coral, 0x55c9bd, 0xa98de8];
    const color = completed ? palette.mintDark : colors[index];
    const compact = this.sceneWidth < 500;
    const pulse = this.add.circle(x, y, compact ? 49 : 60, color, completed ? 0.18 : 0.3).setDepth(5);
    if (!completed && !isReducedMotion()) {
      this.tweens.add({ targets: pulse, scale: 1.24, alpha: 0.06, duration: 900, yoyo: true, repeat: -1 });
    }
    const marker = this.add.circle(x, y, compact ? 38 : 47, color, 1).setStrokeStyle(compact ? 4 : 5, palette.white, 0.9).setDepth(6);
    const symbol = this.add
      .text(x, y - 2, completed ? "✓" : icon, {
        fontFamily: "Trebuchet MS",
        fontSize: completed ? (compact ? "34px" : "42px") : compact ? "31px" : "38px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(7);
    const button = this.button(x, y + (compact ? 64 : 82), completed ? `✓ ${label}` : label, () => {
      updateProgress({ selectedMissionId: missionId });
      setCurrentScene("ReadingScene");
      this.scene.start("ReadingScene");
    }, { width: compact ? Math.min(170, this.sceneWidth * 0.44) : Math.min(250, this.sceneWidth * 0.48), color, fontSize: compact ? 13 : 19, depth: 8 });
    marker.setInteractive({ useHandCursor: true }).on("pointerup", () => button.emit("pointerup"));
    symbol.setInteractive({ useHandCursor: true }).on("pointerup", () => button.emit("pointerup"));
  }
}
