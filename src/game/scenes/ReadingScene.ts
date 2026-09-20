import Phaser from "phaser";
import { firstMission } from "../content";
import { getProgress, setCurrentScene, updateProgress } from "../progress";
import { announce, isReducedMotion } from "../settings";
import { BaseScene, palette } from "../ui";

export class ReadingScene extends BaseScene {
  private wrongAnswers = 0;
  private optionButtons: Phaser.GameObjects.Container[] = [];
  private feedback?: Phaser.GameObjects.Text;

  constructor() {
    super("ReadingScene");
  }

  create(): void {
    this.prepareScene("island", 0.52);
    setCurrentScene("ReadingScene");
    this.title(firstMission.area, firstMission.title);
    const portrait = this.sceneHeight > this.sceneWidth;
    const panelWidth = portrait ? this.sceneWidth - 24 : Math.min(760, this.sceneWidth * 0.62);
    const panelHeight = portrait ? Math.min(560, this.sceneHeight * 0.68) : Math.min(520, this.sceneHeight * 0.72);
    const panelX = portrait ? 12 : this.sceneWidth - panelWidth - 28;
    const panelY = portrait ? this.sceneHeight - panelHeight - 14 : this.sceneHeight - panelHeight - 24;
    this.panel(panelX, panelY, panelWidth, panelHeight);

    const dino = this.fitImage(
      this.add.image(portrait ? 58 : panelX * 0.46, portrait ? 214 : this.sceneHeight * 0.61, "minti"),
      portrait ? 108 : Math.min(320, this.sceneWidth * 0.27),
      portrait ? 150 : this.sceneHeight * 0.62,
    );
    dino.setDepth(4);
    this.idle(dino, 5);

    const centerX = panelX + panelWidth / 2;
    const promptY = panelY + 54;
    this.add
      .text(centerX, promptY, firstMission.prompt, {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 24 : 30}px`,
        fontStyle: "bold",
        color: "#173f38",
        align: "center",
        wordWrap: { width: panelWidth - 56 },
      })
      .setOrigin(0.5);

    this.drawSun(centerX - (portrait ? 94 : 120), panelY + (portrait ? 150 : 168), portrait ? 37 : 46);
    this.add
      .text(centerX + (portrait ? 22 : 30), panelY + (portrait ? 150 : 168), firstMission.targetWord, {
        fontFamily: "Trebuchet MS, Arial Rounded MT Bold",
        fontSize: `${portrait ? 62 : 82}px`,
        fontStyle: "bold",
        color: "#173f38",
        letterSpacing: 7,
      })
      .setOrigin(0.5);

    const optionY = panelY + (portrait ? 270 : 302);
    const optionGap = Math.min(150, panelWidth / 3.4);
    firstMission.choices.forEach((choice, index) => {
      const button = this.button(centerX + (index - 1) * optionGap, optionY, choice, () => this.choose(choice, button), {
        width: Math.min(116, panelWidth * 0.25),
        color: 0xfff2bf,
        fontSize: 46,
      });
      this.optionButtons.push(button);
    });

    this.feedback = this.add
      .text(centerX, panelY + (portrait ? 351 : 388), "Toca una respuesta.", {
        fontFamily: "Trebuchet MS",
        fontSize: `${portrait ? 18 : 21}px`,
        fontStyle: "bold",
        color: "#317565",
        align: "center",
        wordWrap: { width: panelWidth - 64 },
      })
      .setOrigin(0.5);

    this.button(centerX, panelY + panelHeight - 54, "🔊 Escuchar otra vez", () => {
      this.say(firstMission.spokenPrompt);
      announce(firstMission.spokenPrompt);
    }, { width: Math.min(310, panelWidth - 36), color: palette.mint, fontSize: portrait ? 20 : 22 });

    if (getProgress().lessonCompleted) this.showCompletedState(centerX, panelY, panelWidth, panelHeight);
    this.time.delayedCall(350, () => this.say(firstMission.spokenPrompt));
    announce(firstMission.spokenPrompt);
  }

  private choose(choice: string, button: Phaser.GameObjects.Container): void {
    if (choice === firstMission.answer) {
      this.correct(button);
      return;
    }

    this.wrongAnswers += 1;
    updateProgress({ attempts: getProgress().attempts + 1 });
    this.say(firstMission.retry);
    announce(firstMission.retry);
    if (this.feedback) {
      this.feedback.setText(this.wrongAnswers >= 2 ? `${firstMission.retry}\n${firstMission.hint}` : firstMission.retry);
      this.feedback.setColor("#b45043");
    }
    if (!isReducedMotion()) {
      this.tweens.add({ targets: button, x: "+=10", duration: 65, yoyo: true, repeat: 3 });
    }
    if (this.wrongAnswers >= 2) {
      const extraWrong = this.optionButtons.find((item) => item !== button && item.getAt(2) instanceof Phaser.GameObjects.Text && (item.getAt(2) as Phaser.GameObjects.Text).text !== firstMission.answer);
      if (extraWrong) extraWrong.setAlpha(0.28).disableInteractive();
    }
  }

  private correct(button: Phaser.GameObjects.Container): void {
    this.optionButtons.forEach((option) => option.disableInteractive());
    button.setScale(1.08);
    updateProgress({ lessonCompleted: true, decorations: Math.max(1, getProgress().decorations), attempts: getProgress().attempts + 1 });
    this.say("¡Lo encontraste! Sol empieza así. Ganaste una piedra del sol.");
    announce("Respuesta correcta. Ganaste una piedra del sol.");
    if (this.feedback) this.feedback.setText(firstMission.success).setColor("#23735e");
    this.confetti(button.x, button.y);
    this.time.delayedCall(500, () => {
      this.toast("☀️ ¡Ganaste una piedra del sol!", palette.sun);
      this.button(this.sceneWidth / 2, this.sceneHeight - 154, "Volver al refugio", () => {
        setCurrentScene("RefugeScene");
        this.scene.start("RefugeScene");
      }, { width: Math.min(330, this.sceneWidth - 36), color: palette.coral, depth: 90 });
    });
  }

  private showCompletedState(centerX: number, panelY: number, panelWidth: number, panelHeight: number): void {
    this.optionButtons.forEach((option) => option.disableInteractive());
    if (this.feedback) this.feedback.setText("Ya encontraste el comienzo de SOL.").setColor("#23735e");
    this.button(centerX, panelY + panelHeight - 128, "Ir al refugio", () => {
      setCurrentScene("RefugeScene");
      this.scene.start("RefugeScene");
    }, { width: Math.min(280, panelWidth - 36), color: palette.sun });
  }

  private drawSun(x: number, y: number, radius: number): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(8, palette.sun, 1);
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      graphics.lineBetween(x + Math.cos(angle) * (radius + 8), y + Math.sin(angle) * (radius + 8), x + Math.cos(angle) * (radius + 23), y + Math.sin(angle) * (radius + 23));
    }
    graphics.fillStyle(palette.sun, 1);
    graphics.fillCircle(x, y, radius);
  }

  private confetti(x: number, y: number): void {
    if (isReducedMotion()) return;
    const colors = [palette.sun, palette.coral, palette.mint, palette.ocean];
    for (let index = 0; index < 20; index += 1) {
      const dot = this.add.circle(x, y, Phaser.Math.Between(4, 8), colors[index % colors.length]).setDepth(70);
      this.tweens.add({
        targets: dot,
        x: x + Phaser.Math.Between(-180, 180),
        y: y + Phaser.Math.Between(-160, 120),
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(650, 1050),
        ease: "Quad.Out",
        onComplete: () => dot.destroy(),
      });
    }
  }
}
