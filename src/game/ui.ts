import Phaser from "phaser";
import { isReducedMotion, speak, unlockAudio } from "./settings";

export const palette = {
  ink: 0x173f38,
  cream: 0xfff8dc,
  mint: 0x70d6b2,
  mintDark: 0x31896f,
  coral: 0xff7f67,
  sun: 0xffd85b,
  ocean: 0x4cc9e8,
  white: 0xffffff,
};

export class BaseScene extends Phaser.Scene {
  protected sceneWidth = 0;
  protected sceneHeight = 0;

  protected prepareScene(backgroundKey?: string, shade = 0.12): void {
    this.sceneWidth = this.scale.width;
    this.sceneHeight = this.scale.height;
    this.cameras.main.setBackgroundColor("#173f38");

    if (backgroundKey) {
      const background = this.add.image(this.sceneWidth / 2, this.sceneHeight / 2, backgroundKey);
      const cover = Math.max(this.sceneWidth / background.width, this.sceneHeight / background.height);
      background.setScale(cover).setDepth(-20);
    }

    if (shade > 0) {
      this.add
        .rectangle(this.sceneWidth / 2, this.sceneHeight / 2, this.sceneWidth, this.sceneHeight, 0x082f2c, shade)
        .setDepth(-10);
    }

    const restartOnResize = (): void => {
      this.scene.restart();
    };
    this.scale.once(Phaser.Scale.Events.RESIZE, restartOnResize);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, restartOnResize);
    });
  }

  protected title(text: string, subtitle?: string): Phaser.GameObjects.Container {
    const portrait = this.sceneHeight > this.sceneWidth;
    const maxWidth = Math.min(this.sceneWidth - 32, portrait ? 560 : 720);
    const panelHeight = subtitle ? 116 : 82;
    const container = this.add.container(portrait ? 14 : 20, portrait ? 64 : 18).setDepth(10);
    const panel = this.add.graphics();
    panel.fillStyle(palette.cream, 0.94);
    panel.fillRoundedRect(0, 0, maxWidth, panelHeight, 30);
    panel.lineStyle(3, palette.white, 0.7);
    panel.strokeRoundedRect(0, 0, maxWidth, panelHeight, 30);
    const title = this.add.text(28, subtitle ? 18 : 21, text, {
      fontFamily: "Trebuchet MS, Arial Rounded MT Bold, sans-serif",
      fontSize: `${portrait ? 30 : 38}px`,
      fontStyle: "bold",
      color: "#173f38",
    });
    container.add([panel, title]);
    if (subtitle) {
      container.add(
        this.add.text(30, 68, subtitle, {
          fontFamily: "Trebuchet MS, sans-serif",
          fontSize: `${portrait ? 17 : 20}px`,
          fontStyle: "bold",
          color: "#317565",
          wordWrap: { width: maxWidth - 58 },
        }),
      );
    }
    return container;
  }

  protected panel(x: number, y: number, width: number, height: number, alpha = 0.95): Phaser.GameObjects.Graphics {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x102f2a, 0.2);
    graphics.fillRoundedRect(x + 8, y + 10, width, height, 34);
    graphics.fillStyle(palette.cream, alpha);
    graphics.fillRoundedRect(x, y, width, height, 34);
    graphics.lineStyle(4, palette.white, 0.66);
    graphics.strokeRoundedRect(x, y, width, height, 34);
    return graphics;
  }

  protected button(
    x: number,
    y: number,
    label: string,
    onPress: () => void,
    options: { width?: number; color?: number; fontSize?: number; depth?: number } = {},
  ): Phaser.GameObjects.Container {
    const width = options.width ?? 250;
    const height = 70;
    const container = this.add.container(x, y).setDepth(options.depth ?? 20);
    const shadow = this.add.graphics();
    shadow.fillStyle(0x102f2a, 0.25);
    shadow.fillRoundedRect(-width / 2, -height / 2 + 7, width, height, 26);
    const background = this.add.graphics();
    const color = options.color ?? palette.coral;
    const draw = (fill: number): void => {
      background.clear();
      background.fillStyle(fill, 1);
      background.fillRoundedRect(-width / 2, -height / 2, width, height, 26);
      background.lineStyle(4, palette.white, 0.84);
      background.strokeRoundedRect(-width / 2, -height / 2, width, height, 26);
    };
    draw(color);
    const text = this.add
      .text(0, -2, label, {
        fontFamily: "Trebuchet MS, Arial Rounded MT Bold, sans-serif",
        fontSize: `${options.fontSize ?? 26}px`,
        fontStyle: "bold",
        color: "#173f38",
        align: "center",
      })
      .setOrigin(0.5);
    container.add([shadow, background, text]);
    container.setSize(width, height).setInteractive({ useHandCursor: true });
    container.on("pointerdown", () => {
      unlockAudio();
      if (!isReducedMotion()) container.setScale(0.96);
    });
    container.on("pointerup", () => {
      container.setScale(1);
      onPress();
    });
    container.on("pointerout", () => container.setScale(1));
    container.on("pointerover", () => draw(Phaser.Display.Color.ValueToColor(color).brighten(10).color));
    container.on("pointerout", () => draw(color));
    return container;
  }

  protected fitImage(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): Phaser.GameObjects.Image {
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    return image.setScale(scale);
  }

  protected idle(target: Phaser.GameObjects.Image, distance = 8): void {
    if (isReducedMotion()) return;
    this.tweens.add({
      targets: target,
      y: `-=${distance}`,
      angle: 1.2,
      duration: 1450,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
    });
  }

  protected say(text: string): void {
    speak(text);
  }

  protected toast(text: string, color = palette.mint): Phaser.GameObjects.Container {
    const width = Math.min(this.sceneWidth - 32, 560);
    const y = this.sceneHeight - 66;
    const container = this.add.container(this.sceneWidth / 2, y).setDepth(80);
    const bg = this.add.graphics();
    bg.fillStyle(color, 0.98);
    bg.fillRoundedRect(-width / 2, -38, width, 76, 28);
    bg.lineStyle(4, palette.white, 0.8);
    bg.strokeRoundedRect(-width / 2, -38, width, 76, 28);
    const label = this.add
      .text(0, 0, text, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: `${this.sceneWidth < 520 ? 19 : 24}px`,
        fontStyle: "bold",
        color: "#173f38",
        align: "center",
        wordWrap: { width: width - 42 },
      })
      .setOrigin(0.5);
    container.add([bg, label]);
    return container;
  }
}
