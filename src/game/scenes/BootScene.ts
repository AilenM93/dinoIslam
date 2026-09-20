import Phaser from "phaser";
import { getProgress } from "../progress";
import { palette } from "../ui";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    this.cameras.main.setBackgroundColor("#173f38");
    const title = this.add
      .text(width / 2, height / 2 - 72, "DINO ISLAND", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: `${Math.min(54, width / 8)}px`,
        fontStyle: "bold",
        color: "#fff8dc",
      })
      .setOrigin(0.5);
    const bar = this.add.rectangle(width / 2, height / 2 + 12, Math.min(width * 0.7, 480), 28, 0xffffff, 0.25);
    const fill = this.add.rectangle(bar.x - bar.width / 2 + 3, bar.y, 0, 22, palette.mint).setOrigin(0, 0.5);
    this.load.on("progress", (progress: number) => {
      fill.width = (bar.width - 6) * progress;
    });
    this.load.on("complete", () => title.setText("¡LISTO!"));

    this.load.image("island", "/assets/island-background.png");
    this.load.image("refuge", "/assets/refuge-background.png");
    this.load.image("minti", "/assets/minti-mascot.png");
    this.load.image("nest-clearing", "/assets/nest-clearing-background.png");
    this.load.image("egg-mint-intact", "/assets/egg-mint-intact.png");
    this.load.image("egg-sun-intact", "/assets/egg-sun-intact.png");
    this.load.image("egg-coral-intact", "/assets/egg-coral-intact.png");
    this.load.image("egg-mint-open", "/assets/egg-mint-open.png");
    this.load.image("egg-sun-open", "/assets/egg-sun-open.png");
    this.load.image("egg-coral-open", "/assets/egg-coral-open.png");
    this.load.image("foliage-left", "/assets/foliage-left.png");
    this.load.image("foliage-right", "/assets/foliage-right.png");
  }

  create(): void {
    this.scene.start(getProgress().currentScene);
  }
}
