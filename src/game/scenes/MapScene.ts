import Phaser from "phaser";
import { typography } from "../typography";
import { learningPath, selectMissionForStage } from "../content";
import { getProgress, isZoneMastered, setCurrentScene, updateProgress } from "../progress";
import { announce, isReducedMotion } from "../settings";
import { BaseScene, palette } from "../ui";

interface ZonePoint {
  x: number;
  y: number;
  radius: number;
}

export class MapScene extends BaseScene {
  private mapImage?: Phaser.GameObjects.Image;
  private dino?: Phaser.GameObjects.Image;
  private zoneLabel?: Phaser.GameObjects.Text;
  private hintToast?: Phaser.GameObjects.Container;
  private transitioning = false;

  constructor() {
    super("MapScene");
  }

  create(): void {
    this.prepareScene(undefined, 0);
    setCurrentScene("MapScene");
    this.transitioning = false;
    const progress = getProgress();
    const portrait = this.sceneHeight > this.sceneWidth;
    this.createMapBackground(portrait);

    const completedStageIndices = learningPath
      .map((stage, index) => isZoneMastered(progress, stage.id) ? index : -1)
      .filter((index) => index >= 0);
    const furthestCompleted = completedStageIndices.length > 0 ? Math.max(...completedStageIndices) : -1;
    const unlockedThrough = Math.min(learningPath.length - 1, Math.max(0, furthestCompleted + 1));
    const points = this.zonePoints(portrait);

    learningPath.forEach((stage, index) => {
      const completed = isZoneMastered(progress, stage.id);
      const unlocked = completed || index <= unlockedThrough;
      const point = this.mapPointToScreen(points[index]);
      const scaledRadius = points[index].radius * (this.mapImage?.scaleX ?? 1);
      const fragments = progress.runes[stage.id]?.fragments ?? 0;
      this.adventureZone(point.x, point.y, scaledRadius, stage.name, stage.id, completed, unlocked, fragments, index);
    });

    this.createMinti(portrait);
    this.createProgressTrail(unlockedThrough, completedStageIndices);
    this.createBirthControl();

    const openCount = unlockedThrough + 1;
    announce(`Mapa vivo de Dino Island. Hay ${openCount} zonas abiertas y ${completedStageIndices.length} runas radiantes.`);
  }

  private createMapBackground(portrait: boolean): void {
    const key = portrait ? "adventure-map-mobile" : "adventure-map";
    this.mapImage = this.add.image(this.sceneWidth / 2, this.sceneHeight / 2, key).setDepth(-20);
    const cover = Math.max(this.sceneWidth / this.mapImage.width, this.sceneHeight / this.mapImage.height);
    this.mapImage.setScale(cover);
  }

  private zonePoints(portrait: boolean): ZonePoint[] {
    return portrait
      ? [
          { x: 470, y: 1410, radius: 118 },
          { x: 250, y: 925, radius: 112 },
          { x: 535, y: 915, radius: 108 },
          { x: 675, y: 610, radius: 110 },
          { x: 685, y: 355, radius: 108 },
        ]
      : [
          { x: 590, y: 565, radius: 74 },
          { x: 625, y: 265, radius: 82 },
          { x: 885, y: 505, radius: 72 },
          { x: 1240, y: 610, radius: 82 },
          { x: 1265, y: 300, radius: 78 },
        ];
  }

  private mapPointToScreen(point: ZonePoint): Phaser.Math.Vector2 {
    if (!this.mapImage) return new Phaser.Math.Vector2(this.sceneWidth / 2, this.sceneHeight / 2);
    return new Phaser.Math.Vector2(
      this.mapImage.x - this.mapImage.displayWidth / 2 + point.x * this.mapImage.scaleX,
      this.mapImage.y - this.mapImage.displayHeight / 2 + point.y * this.mapImage.scaleY,
    );
  }

  private adventureZone(
    x: number,
    y: number,
    radius: number,
    label: string,
    stageId: string,
    completed: boolean,
    unlocked: boolean,
    fragments: number,
    index: number,
  ): void {
    const ringColor = completed ? palette.mint : palette.sun;
    const ring = this.add
      .ellipse(x, y, radius * 2.05, radius * 1.48, ringColor, unlocked ? 0.05 : 0.02)
      .setStrokeStyle(Math.max(3, radius * 0.045), ringColor, unlocked ? 0.72 : 0.12)
      .setDepth(3);

    if (unlocked) {
      const flowers = this.fitImage(
        this.add.image(x, y + radius * 0.28, "zone-awaken"),
        radius * 2.55,
        radius * 1.72,
      ).setDepth(2).setAlpha(completed ? 0.82 : 0.58);
      if (!completed && !isReducedMotion()) {
        this.tweens.add({ targets: [ring, flowers], alpha: { from: 0.42, to: 0.88 }, duration: 1050, yoyo: true, repeat: -1 });
      }
      if (completed) this.addCompanion(x, y, radius, index);
    } else {
      this.add.ellipse(x, y, radius * 2.12, radius * 1.56, 0x123d38, 0.42).setDepth(3);
      this.fitImage(this.add.image(x, y, "zone-locked"), radius * 2.45, radius * 2.2).setDepth(4).setAlpha(0.82);
      this.add
        .text(x, y, "🔒", { fontFamily: typography.body, fontSize: `${Math.max(22, radius * 0.42)}px` })
        .setOrigin(0.5)
        .setDepth(5)
        .setAlpha(0.86);
    }

    this.createZoneBadge(x, y, radius, label, fragments, unlocked, completed);

    const target = this.add.circle(x, y, radius, 0xffffff, 0.001).setDepth(9).setInteractive({ useHandCursor: unlocked });
    target.on("pointerover", () => {
      ring.setAlpha(unlocked ? 0.95 : 0.22);
      this.showZoneLabel(x, y - radius * 0.92, label, unlocked);
    });
    target.on("pointerout", () => {
      ring.setAlpha(unlocked ? 1 : 0.12);
      this.zoneLabel?.destroy();
      this.zoneLabel = undefined;
    });
    target.on("pointerup", () => {
      this.zoneLabel?.destroy();
      this.zoneLabel = undefined;
      if (unlocked) {
        this.enterMission(stageId, x, y);
      } else {
        this.showLockedHint(index);
      }
    });
  }

  private createZoneBadge(
    x: number,
    y: number,
    radius: number,
    label: string,
    fragments: number,
    unlocked: boolean,
    completed: boolean,
  ): void {
    const compact = this.sceneWidth < 520;
    const shortLabel = label.split(" de ")[0];
    const labelText = unlocked ? shortLabel : `${shortLabel} · dormida`;
    const badge = this.add
      .text(x, y + radius * 0.88, labelText, {
        fontFamily: typography.body,
        fontSize: `${compact ? 12 : Math.max(13, radius * 0.16)}px`,
        fontStyle: "bold",
        color: unlocked ? "#173f38" : "#fff8dc",
        backgroundColor: unlocked ? "rgba(255,248,220,0.9)" : "rgba(23,63,56,0.82)",
        padding: { x: compact ? 7 : 10, y: compact ? 3 : 5 },
      })
      .setOrigin(0.5)
      .setDepth(8);
    const halfWidth = badge.displayWidth / 2;
    badge.setX(Phaser.Math.Clamp(x, halfWidth + 6, this.sceneWidth - halfWidth - 6));

    const dotY = y + radius * 0.57;
    const spacing = compact ? 10 : Math.max(12, radius * 0.17);
    for (let fragment = 0; fragment < 3; fragment += 1) {
      const filled = fragment < fragments;
      const dot = this.add
        .circle(x + (fragment - 1) * spacing, dotY, compact ? 3.5 : Math.max(4, radius * 0.055), filled ? palette.sun : 0x264c44, unlocked ? 0.96 : 0.42)
        .setDepth(8);
      dot.setStrokeStyle(completed ? 2 : 1.5, completed ? palette.mint : palette.cream, 0.9);
    }
  }

  private addCompanion(x: number, y: number, radius: number, index: number): void {
    const keys = ["companion-sounds", "companion-letters", "companion-syllables", "companion-words", "companion-stories"];
    const offsets = [
      [-0.78, 0.22],
      [0.78, 0.18],
      [0.82, 0.34],
      [0.76, 0.22],
      [-0.75, 0.28],
    ];
    const [offsetX, offsetY] = offsets[index];
    const companion = this.fitImage(
      this.add.image(x + radius * offsetX, y + radius * offsetY, keys[index]),
      radius * 0.88,
      radius * 1.08,
    ).setDepth(7);
    this.idle(companion, 2);
  }

  private showZoneLabel(x: number, y: number, label: string, unlocked: boolean): void {
    this.zoneLabel?.destroy();
    this.zoneLabel = this.add
      .text(x, y, unlocked ? label : `${label} · dormida`, {
        fontFamily: typography.body,
        fontSize: `${this.sceneWidth < 520 ? 15 : 19}px`,
        fontStyle: "bold",
        color: unlocked ? "#173f38" : "#fff8dc",
        backgroundColor: unlocked ? "rgba(255,248,220,0.94)" : "rgba(23,63,56,0.88)",
        padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(30);
    const halfWidth = this.zoneLabel.displayWidth / 2;
    this.zoneLabel.setX(Phaser.Math.Clamp(x, halfWidth + 8, this.sceneWidth - halfWidth - 8));
  }

  private showLockedHint(index: number): void {
    const previous = learningPath[Math.max(0, index - 1)];
    const message = `Esta zona despertará después de explorar ${previous.name}.`;
    this.hintToast?.destroy();
    this.hintToast = this.toast(message, palette.cream);
    this.say(message);
    announce(message);
  }

  private createMinti(portrait: boolean): void {
    const sourcePoint = portrait ? { x: 145, y: 1510, radius: 0 } : { x: 190, y: 805, radius: 0 };
    const position = this.mapPointToScreen(sourcePoint);
    this.dino = this.fitImage(
      this.add.image(position.x, position.y, "minti-walk"),
      portrait ? 94 : 185,
      portrait ? 128 : 250,
    ).setDepth(8);
    this.idle(this.dino, portrait ? 3 : 4);
  }

  private createProgressTrail(unlockedThrough: number, completedStageIndices: number[]): void {
    const compact = this.sceneWidth < 520;
    const startX = compact ? 24 : 30;
    const y = compact ? 30 : 34;
    learningPath.forEach((_stage, index) => {
      const completed = completedStageIndices.includes(index);
      const unlocked = index <= unlockedThrough;
      const color = completed ? palette.mint : unlocked ? palette.sun : 0x456d66;
      const bead = this.add.circle(startX + index * (compact ? 24 : 30), y, compact ? 7 : 9, color, 0.96).setDepth(25);
      bead.setStrokeStyle(2, palette.cream, unlocked ? 0.95 : 0.45);
    });
  }

  private createBirthControl(): void {
    const compact = this.sceneWidth < 520;
    const x = this.sceneWidth - (compact ? 48 : 58);
    const y = this.sceneHeight - (compact ? 50 : 58);
    const size = compact ? 76 : 90;
    const stone = this.fitImage(this.add.image(x, y, "stone-control"), size, size).setDepth(20);
    const baseScale = stone.scaleX;
    const symbol = this.add
      .text(x, y, "↺", {
        fontFamily: typography.body,
        fontSize: `${compact ? 28 : 34}px`,
        fontStyle: "bold",
        color: "#fff8dc",
      })
      .setOrigin(0.5)
      .setDepth(21);
    const target = this.add.circle(x, y, size / 2, 0xffffff, 0.001).setDepth(22).setInteractive({ useHandCursor: true });
    target.on("pointerover", () => stone.setScale(baseScale * 1.06));
    target.on("pointerout", () => stone.setScale(baseScale));
    target.on("pointerup", () => {
      stone.setScale(baseScale * 0.96);
      symbol.setScale(0.96);
      this.scene.start("BirthScene", { replayIntro: true });
    });
  }

  private enterMission(stageId: string, targetX: number, targetY: number): void {
    if (this.transitioning) return;
    this.transitioning = true;
    const progress = getProgress();
    const mission = selectMissionForStage(stageId, progress.attemptHistory);
    const missionId = mission.id;
    updateProgress({ selectedMissionId: missionId });
    setCurrentScene("ReadingScene");
    const openMission = (): void => {
      this.scene.start("ReadingScene");
    };
    if (!this.dino || isReducedMotion()) {
      openMission();
      return;
    }
    this.tweens.killTweensOf(this.dino);
    this.dino.setAngle(0);
    this.tweens.add({
      targets: this.dino,
      x: this.dino.x + (targetX - this.dino.x) * 0.72,
      y: this.dino.y + (targetY - this.dino.y) * 0.62,
      angle: -3,
      duration: 680,
      ease: "Sine.InOut",
      onComplete: openMission,
    });
  }
}
