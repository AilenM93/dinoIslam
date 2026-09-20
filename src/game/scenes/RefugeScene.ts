import { getProgress, resetProgress, setCurrentScene } from "../progress";
import { announce } from "../settings";
import { BaseScene, palette } from "../ui";

export class RefugeScene extends BaseScene {
  constructor() {
    super("RefugeScene");
  }

  create(): void {
    this.prepareScene("refuge", 0.08);
    setCurrentScene("RefugeScene");
    const progress = getProgress();
    this.title("De vuelta en el refugio", "Una aventura corta, un recuerdo nuevo.");
    const portrait = this.sceneHeight > this.sceneWidth;

    const dino = this.fitImage(
      this.add.image(portrait ? this.sceneWidth * 0.72 : this.sceneWidth * 0.79, portrait ? this.sceneHeight * 0.38 : this.sceneHeight * 0.48, "minti"),
      portrait ? this.sceneWidth * 0.48 : this.sceneWidth * 0.25,
      portrait ? this.sceneHeight * 0.32 : this.sceneHeight * 0.56,
    );
    this.idle(dino, 4);

    const panelWidth = Math.min(portrait ? this.sceneWidth - 28 : 480, this.sceneWidth - 28);
    const panelHeight = portrait ? 314 : 342;
    const panelX = portrait ? 14 : 34;
    const panelY = portrait ? this.sceneHeight - panelHeight - 22 : this.sceneHeight * 0.28;
    this.panel(panelX, panelY, panelWidth, panelHeight, 0.94);
    const centerX = panelX + panelWidth / 2;

    this.add
      .text(centerX, panelY + 40, progress.decorations > 0 ? "¡Recuerdo conseguido!" : "El refugio te espera", {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 25 : 30}px`,
        fontStyle: "bold",
        color: "#173f38",
      })
      .setOrigin(0.5);

    if (progress.decorations > 0) this.drawRewardStone(centerX, panelY + 128);
    this.add
      .text(centerX, panelY + 204, progress.decorations > 0 ? "Piedra del sol\nTu colección empieza aquí." : "Completa la misión para traer un recuerdo.", {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 18 : 21}px`,
        fontStyle: "bold",
        color: "#317565",
        align: "center",
      })
      .setOrigin(0.5);

    const buttonY = panelY + panelHeight - 54;
    this.button(centerX - (portrait ? 88 : 112), buttonY, "Mapa", () => {
      setCurrentScene("MapScene");
      this.scene.start("MapScene");
    }, { width: portrait ? 150 : 190, color: palette.mint, fontSize: 22 });
    this.button(centerX + (portrait ? 88 : 112), buttonY, "Otra vez", () => {
      setCurrentScene("ReadingScene");
      this.scene.start("ReadingScene");
    }, { width: portrait ? 150 : 190, color: palette.sun, fontSize: 22 });

    const reset = this.add
      .text(this.sceneWidth - 18, this.sceneHeight - 18, "Empezar una nueva aventura", {
        fontFamily: "Trebuchet MS",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#fff8dc",
        backgroundColor: "rgba(19,63,56,0.72)",
        padding: { x: 12, y: 9 },
      })
      .setOrigin(1)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });
    reset.on("pointerup", () => {
      resetProgress();
      this.scene.start("BirthScene");
    });

    this.time.delayedCall(350, () => this.say("¡Qué aventura! Tu piedra del sol ya está a salvo en el refugio."));
    announce("Misión terminada. La piedra del sol está en el refugio.");
  }

  private drawRewardStone(x: number, y: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x6d756a, 1);
    graphics.fillEllipse(x, y, 132, 96);
    graphics.lineStyle(4, 0x9ca595, 1);
    graphics.strokeEllipse(x, y, 132, 96);
    graphics.fillStyle(palette.sun, 1);
    graphics.fillCircle(x, y, 21);
    graphics.lineStyle(6, palette.sun, 1);
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      graphics.lineBetween(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30, x + Math.cos(angle) * 40, y + Math.sin(angle) * 40);
    }
  }
}
