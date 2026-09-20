import { learningPath } from "../content";
import { setCurrentScene } from "../progress";
import { announce, isReducedMotion } from "../settings";
import { BaseScene, palette } from "../ui";

export class MapScene extends BaseScene {
  constructor() {
    super("MapScene");
  }

  create(): void {
    this.prepareScene("island", 0.04);
    setCurrentScene("MapScene");
    this.title("Explora la isla", "La primera misión te espera en el Bosque de letras.");
    const portrait = this.sceneHeight > this.sceneWidth;
    const dino = this.fitImage(
      this.add.image(portrait ? this.sceneWidth * 0.18 : this.sceneWidth * 0.11, this.sceneHeight * 0.79, "minti"),
      portrait ? 130 : 220,
      portrait ? 180 : 300,
    );
    this.idle(dino, 5);

    const nodes = portrait
      ? [
          [0.23, 0.76],
          [0.48, 0.47],
          [0.68, 0.64],
          [0.74, 0.37],
          [0.52, 0.27],
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
      if (index === 1) this.activeMarker(x * this.sceneWidth, y * this.sceneHeight, stage.name);
      else this.futureMarker(x * this.sceneWidth, y * this.sceneHeight, index === 0 ? "✓ Bienvenida" : stage.name);
    });
    this.button(this.sceneWidth - Math.min(122, this.sceneWidth * 0.24), this.sceneHeight - 40, "↺ Nacimiento", () => {
      this.scene.start("BirthScene", { replayIntro: true });
    }, {
      width: Math.min(220, this.sceneWidth * 0.44),
      color: palette.cream,
      fontSize: this.sceneWidth < 520 ? 16 : 19,
      depth: 12,
    });
    announce("Mapa de Dino Island. El Bosque de letras está disponible.");
  }

  private activeMarker(x: number, y: number, label: string): void {
    const pulse = this.add.circle(x, y, 62, palette.sun, 0.32).setDepth(5);
    if (!isReducedMotion()) {
      this.tweens.add({ targets: pulse, scale: 1.24, alpha: 0.06, duration: 900, yoyo: true, repeat: -1 });
    }
    const marker = this.add.circle(x, y, 48, palette.sun, 1).setStrokeStyle(5, palette.white, 0.9).setDepth(6);
    const tree = this.add.text(x, y - 2, "🌳", { fontSize: "42px" }).setOrigin(0.5).setDepth(7);
    const button = this.button(x, y + 88, label, () => {
      setCurrentScene("ReadingScene");
      this.scene.start("ReadingScene");
    }, { width: Math.min(260, this.sceneWidth * 0.52), color: palette.mint, fontSize: this.sceneWidth < 500 ? 18 : 22, depth: 8 });
    marker.setInteractive({ useHandCursor: true }).on("pointerup", () => button.emit("pointerup"));
    tree.setInteractive({ useHandCursor: true }).on("pointerup", () => button.emit("pointerup"));
  }

  private futureMarker(x: number, y: number, label: string): void {
    const available = label.startsWith("✓");
    this.add.circle(x, y, 29, available ? palette.mintDark : 0x536c66, 0.86).setStrokeStyle(3, palette.white, 0.72).setDepth(3);
    this.add
      .text(x, y, available ? "✓" : "•", { fontFamily: "Trebuchet MS", fontSize: "25px", fontStyle: "bold", color: "#ffffff" })
      .setOrigin(0.5)
      .setDepth(4);
    this.add
      .text(x, y + 39, label, {
        fontFamily: "Trebuchet MS",
        fontSize: `${this.sceneWidth < 520 ? 13 : 16}px`,
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.78)",
        padding: { x: 9, y: 6 },
        align: "center",
        wordWrap: { width: 150 },
      })
      .setOrigin(0.5, 0)
      .setDepth(4);
  }
}
