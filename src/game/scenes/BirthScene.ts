import Phaser from "phaser";
import { getProgress, setCurrentScene, updateProgress } from "../progress";
import {
  announce,
  isReducedMotion,
  isSoundEnabled,
  playChirp,
  playCrack,
  startAmbient,
  stopAmbient,
} from "../settings";
import { BaseScene, palette } from "../ui";

interface BirthSceneData {
  replayIntro?: boolean;
}

export class BirthScene extends BaseScene {
  private replayIntro = false;
  private island?: Phaser.GameObjects.Image;
  private clearing?: Phaser.GameObjects.Image;
  private leftFoliage?: Phaser.GameObjects.Image;
  private rightFoliage?: Phaser.GameObjects.Image;
  private introUi: Phaser.GameObjects.GameObject[] = [];
  private eggs: Phaser.GameObjects.Image[] = [];
  private instruction?: Phaser.GameObjects.Container;
  private soundChangeHandler = (): void => {
    if (isSoundEnabled()) startAmbient();
  };

  constructor() {
    super("BirthScene");
  }

  init(data: BirthSceneData = {}): void {
    this.replayIntro = Boolean(data.replayIntro);
  }

  create(): void {
    this.sceneWidth = this.scale.width;
    this.sceneHeight = this.scale.height;
    this.cameras.main.setBackgroundColor("#173f38");
    const restartOnResize = (): void => {
      this.scene.restart({ replayIntro: this.replayIntro });
    };
    this.scale.once(Phaser.Scale.Events.RESIZE, restartOnResize);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, restartOnResize);
      stopAmbient();
      window.removeEventListener("dino-sound-change", this.soundChangeHandler);
    });
    window.addEventListener("dino-sound-change", this.soundChangeHandler);
    setCurrentScene("BirthScene");

    const progress = getProgress();
    if (progress.hatched && !this.replayIntro) {
      this.showSavedBirth(progress.eggChoice ?? 1);
      return;
    }
    this.showIslandOpening();
  }

  private showIslandOpening(): void {
    this.island = this.addCoverImage("island", -20);
    const shade = this.add
      .rectangle(this.sceneWidth / 2, this.sceneHeight / 2, this.sceneWidth, this.sceneHeight, 0x082f2c, 0.08)
      .setDepth(-10);
    const title = this.title("Dino Island", "Escucha, toca y descubre.");
    const start = this.button(this.sceneWidth / 2, this.sceneHeight - 86, "▶  Comenzar", () => this.beginDiscovery(), {
      width: Math.min(300, this.sceneWidth - 42),
      color: palette.sun,
      fontSize: 28,
    });
    const glow = this.add.circle(start.x, start.y, 76, palette.sun, 0.2).setDepth(19);
    if (!isReducedMotion()) {
      this.tweens.add({ targets: glow, scale: 1.22, alpha: 0.05, duration: 950, yoyo: true, repeat: -1 });
    }
    this.introUi = [shade, title, start, glow];
    announce("Toca Comenzar para escuchar y descubrir qué ocurre en la isla.");
  }

  private beginDiscovery(): void {
    this.introUi.forEach((item) => item.destroy());
    this.introUi = [];
    startAmbient();
    playChirp();

    const pointX = this.sceneWidth * (this.sceneHeight > this.sceneWidth ? 0.22 : 0.21);
    const pointY = this.sceneHeight * (this.sceneHeight > this.sceneWidth ? 0.78 : 0.81);
    const rustle = this.createRustle(pointX, pointY);
    const focus = this.add.circle(pointX, pointY, 38, palette.sun, 0.2).setStrokeStyle(4, palette.cream, 0.82).setDepth(8);
    const question = this.add
      .text(pointX + (this.sceneHeight > this.sceneWidth ? 74 : 112), pointY - 44, "¿Escuchaste eso?", {
        fontFamily: "Trebuchet MS",
        fontSize: `${this.sceneWidth < 520 ? 18 : 24}px`,
        fontStyle: "bold",
        color: "#173f38",
        backgroundColor: "rgba(255,248,220,0.94)",
        padding: { x: 16, y: 11 },
      })
      .setOrigin(0.5)
      .setDepth(9)
      .setAlpha(0);

    if (isReducedMotion()) {
      question.setAlpha(1);
    } else {
      this.tweens.add({ targets: rustle.list, angle: { from: -4, to: 4 }, duration: 130, yoyo: true, repeat: 4 });
      this.tweens.add({ targets: focus, scale: 1.28, alpha: 0.04, duration: 620, yoyo: true, repeat: 1 });
      this.tweens.add({ targets: question, alpha: 1, y: question.y - 10, duration: 300, ease: "Back.Out" });
    }
    playCrack();
    this.say("¿Escuchaste eso?");
    announce("Algo se mueve entre las plantas. La aventura se acerca a ese lugar.");
    this.time.delayedCall(isReducedMotion() ? 850 : 1450, () => this.transitionToClearing([rustle, focus, question]));
  }

  private transitionToClearing(discoveryObjects: Phaser.GameObjects.GameObject[]): void {
    if (!this.island) return;
    this.clearing = this.addCoverImage("nest-clearing", -19).setAlpha(0);
    this.createFoliageCurtain();
    const reduced = isReducedMotion();

    if (!reduced) {
      this.tweens.add({
        targets: this.island,
        x: this.island.x + this.sceneWidth * 0.12,
        y: this.island.y - this.sceneHeight * 0.06,
        scaleX: this.island.scaleX * 1.14,
        scaleY: this.island.scaleY * 1.14,
        duration: 900,
        ease: "Sine.InOut",
      });
      this.tweens.add({ targets: this.leftFoliage, x: this.sceneWidth * 0.22, alpha: 1, duration: 760, delay: 280, ease: "Sine.InOut" });
      this.tweens.add({ targets: this.rightFoliage, x: this.sceneWidth * 0.78, alpha: 1, duration: 760, delay: 280, ease: "Sine.InOut" });
    } else {
      this.leftFoliage?.setAlpha(0.86);
      this.rightFoliage?.setAlpha(0.86);
    }

    this.time.delayedCall(reduced ? 120 : 780, () => {
      this.tweens.add({ targets: this.clearing, alpha: 1, duration: reduced ? 520 : 680, ease: "Sine.InOut" });
      this.tweens.add({ targets: this.island, alpha: 0, duration: reduced ? 520 : 680, ease: "Sine.InOut" });
    });

    this.time.delayedCall(reduced ? 720 : 1510, () => {
      discoveryObjects.forEach((item) => item.destroy());
      if (this.leftFoliage && this.rightFoliage) {
        this.tweens.add({
          targets: this.leftFoliage,
          x: -this.leftFoliage.displayWidth * 0.17,
          alpha: 0.9,
          duration: reduced ? 320 : 650,
          ease: "Sine.Out",
        });
        this.tweens.add({
          targets: this.rightFoliage,
          x: this.sceneWidth + this.rightFoliage.displayWidth * 0.17,
          alpha: 0.9,
          duration: reduced ? 320 : 650,
          ease: "Sine.Out",
        });
      }
      this.time.delayedCall(reduced ? 300 : 620, () => this.revealEggs());
    });
  }

  private revealEggs(): void {
    this.eggs = this.createEggs(true);
    this.eggs.forEach((egg, index) => {
      const targetScale = egg.scaleX;
      egg.setScale(targetScale * 0.86).setAlpha(0);
      this.tweens.add({
        targets: egg,
        scaleX: targetScale,
        scaleY: targetScale,
        alpha: 1,
        duration: isReducedMotion() ? 280 : 430,
        delay: index * 110,
        ease: "Back.Out",
      });
      this.time.delayedCall(520 + index * 320, () => this.wiggleEgg(egg));
    });

    this.time.delayedCall(isReducedMotion() ? 760 : 1500, () => {
      this.instruction = this.title("Tres huevos...", "Toca el que quieras descubrir.");
      this.say("Hay tres huevos. Toca uno para descubrir quién está dentro.");
      announce("Hay tres huevos enteros en un solo nido. Toca uno para elegirlo.");
    });
  }

  private hatch(index: number): void {
    const selected = this.eggs[index];
    if (!selected || !selected.input?.enabled) return;
    this.eggs.forEach((egg) => egg.disableInteractive());
    updateProgress({ eggChoice: index, hatched: true });
    this.instruction?.destroy();
    this.say("¡Crac, crac! Tu nueva amiga está saliendo del huevo.");
    playCrack();
    const crack = this.drawCrack(selected);

    const open = (): void => {
      playCrack();
      crack.destroy();
      this.presentHatched(index, true);
    };

    if (isReducedMotion()) {
      this.time.delayedCall(360, open);
      return;
    }
    this.tweens.add({
      targets: selected,
      angle: { from: -4, to: 4 },
      scaleX: selected.scaleX * 1.045,
      scaleY: selected.scaleY * 1.045,
      duration: 105,
      yoyo: true,
      repeat: 4,
      onComplete: open,
    });
  }

  private presentHatched(index: number, animate: boolean): void {
    const selected = this.eggs[index];
    if (!selected) return;
    const shellKeys = ["egg-mint-open", "egg-sun-open", "egg-coral-open"];
    const shell = this.add.image(selected.x, selected.y, shellKeys[index]).setOrigin(0.5, 1).setDepth(15);
    this.fitImage(shell, selected.displayWidth * 1.35, selected.displayHeight * 0.7);
    const targetDino = this.fitImage(
      this.add.image(selected.x, selected.y - shell.displayHeight * 0.05, "minti").setOrigin(0.5, 1).setDepth(14),
      this.sceneHeight > this.sceneWidth ? this.sceneWidth * 0.43 : Math.min(260, this.sceneWidth * 0.2),
      this.sceneHeight > this.sceneWidth ? this.sceneHeight * 0.3 : this.sceneHeight * 0.44,
    );
    const dinoScale = targetDino.scaleX;
    if (animate) {
      const shellScale = shell.scaleX;
      shell.setAlpha(0).setScale(shellScale * 0.92);
      targetDino.setAlpha(0).setScale(dinoScale * 0.15);
      this.tweens.add({ targets: selected, alpha: 0, duration: 260 });
      this.tweens.add({ targets: shell, alpha: 1, scaleX: shellScale, scaleY: shellScale, duration: 360, ease: "Back.Out" });
      this.tweens.add({
        targets: targetDino,
        alpha: 1,
        scaleX: dinoScale,
        scaleY: dinoScale,
        duration: 560,
        delay: 180,
        ease: "Back.Out",
        onComplete: () => this.finishBirth(targetDino),
      });
    } else {
      selected.setVisible(false);
      this.finishBirth(targetDino, false);
    }
  }

  private finishBirth(dino: Phaser.GameObjects.Image, speakGreeting = true): void {
    this.instruction?.destroy();
    this.instruction = this.title("¡Hola! Soy Minti", "Tu compañera para explorar sonidos, letras y cuentos.");
    if (!isReducedMotion()) this.idle(dino, 4);
    if (speakGreeting) {
      playChirp();
      this.say("¡Hola! Soy Minti. ¿Exploramos la isla juntas?");
    }
    this.button(this.sceneWidth / 2, this.sceneHeight - 62, "Explorar la isla", () => this.goToMap(), {
      width: Math.min(320, this.sceneWidth - 40),
      color: palette.sun,
      depth: 30,
    });
    announce("Minti nació en el huevo elegido. Toca Explorar la isla para continuar.");
  }

  private showSavedBirth(eggChoice: number): void {
    this.clearing = this.addCoverImage("nest-clearing", -20);
    this.createFoliageCurtain(true);
    this.eggs = this.createEggs(false);
    this.presentHatched(Phaser.Math.Clamp(eggChoice, 0, 2), false);
  }

  private createEggs(interactive: boolean): Phaser.GameObjects.Image[] {
    const portrait = this.sceneHeight > this.sceneWidth;
    const anchors = [
      { sourceX: 650, sourceY: 603, scale: 0.96 },
      { sourceX: 836, sourceY: 674, scale: 1.06 },
      { sourceX: 1022, sourceY: 603, scale: 0.96 },
    ];
    const maxWidth = portrait ? this.sceneWidth * 0.34 : Math.min(215, this.sceneWidth * 0.18);
    const maxHeight = portrait ? this.sceneHeight * 0.24 : this.sceneHeight * 0.31;
    const keys = ["egg-mint-intact", "egg-sun-intact", "egg-coral-intact"];
    return keys.map((key, index) => {
      const anchor = this.nestPointToScreen(anchors[index].sourceX, anchors[index].sourceY);
      const egg = this.fitImage(
        this.add.image(anchor.x, anchor.y, key).setOrigin(0.5, 1),
        maxWidth,
        maxHeight,
      )
        .setDepth(12 + index);
      egg.setScale(egg.scaleX * anchors[index].scale);
      const visibleHalfWidth = egg.displayWidth * 0.36;
      egg.setX(Phaser.Math.Clamp(anchor.x, visibleHalfWidth + 10, this.sceneWidth - visibleHalfWidth - 10));
      if (interactive) {
        egg.setInteractive({ useHandCursor: true, pixelPerfect: true, alphaTolerance: 8 });
        egg.on("pointerup", () => this.hatch(index));
      }
      return egg;
    });
  }

  private nestPointToScreen(sourceX: number, sourceY: number): Phaser.Math.Vector2 {
    if (!this.clearing) return new Phaser.Math.Vector2(this.sceneWidth / 2, this.sceneHeight * 0.64);
    return new Phaser.Math.Vector2(
      this.clearing.x - this.clearing.displayWidth / 2 + sourceX * this.clearing.scaleX,
      this.clearing.y - this.clearing.displayHeight / 2 + sourceY * this.clearing.scaleY,
    );
  }

  private wiggleEgg(egg: Phaser.GameObjects.Image): void {
    if (isReducedMotion()) {
      this.tweens.add({ targets: egg, alpha: 0.72, duration: 220, yoyo: true });
      return;
    }
    playCrack();
    this.tweens.add({ targets: egg, angle: { from: -2.2, to: 2.2 }, duration: 120, yoyo: true, repeat: 2 });
  }

  private drawCrack(egg: Phaser.GameObjects.Image): Phaser.GameObjects.Graphics {
    const x = egg.x;
    const y = egg.y - egg.displayHeight * 0.5;
    const size = egg.displayWidth * 0.24;
    const graphics = this.add.graphics().setDepth(25);
    graphics.lineStyle(Math.max(3, egg.displayWidth * 0.018), 0x80604e, 0.88);
    graphics.beginPath();
    graphics.moveTo(x - size * 0.16, y - size * 0.7);
    graphics.lineTo(x + size * 0.13, y - size * 0.25);
    graphics.lineTo(x - size * 0.08, y + size * 0.12);
    graphics.lineTo(x + size * 0.22, y + size * 0.7);
    graphics.moveTo(x + size * 0.12, y - size * 0.24);
    graphics.lineTo(x + size * 0.6, y - size * 0.08);
    graphics.moveTo(x - size * 0.06, y + size * 0.11);
    graphics.lineTo(x - size * 0.52, y + size * 0.36);
    graphics.strokePath();
    return graphics;
  }

  private createRustle(x: number, y: number): Phaser.GameObjects.Container {
    const leaves = [
      this.add.ellipse(-18, 2, 28, 62, 0x2f8f62, 1).setAngle(-32),
      this.add.ellipse(12, -8, 30, 68, 0x4fae6f, 1).setAngle(24),
      this.add.ellipse(32, 16, 24, 54, 0x267454, 1).setAngle(48),
    ];
    return this.add.container(x, y, leaves).setDepth(7);
  }

  private createFoliageCurtain(settled = false): void {
    this.leftFoliage = this.add.image(0, this.sceneHeight / 2, "foliage-left").setDepth(20);
    this.rightFoliage = this.add.image(this.sceneWidth, this.sceneHeight / 2, "foliage-right").setDepth(20);
    const desiredHeight = this.sceneHeight * 1.08;
    this.leftFoliage.setScale(desiredHeight / this.leftFoliage.height);
    this.rightFoliage.setScale(desiredHeight / this.rightFoliage.height);
    if (settled) {
      this.leftFoliage.setX(-this.leftFoliage.displayWidth * 0.17).setAlpha(0.9);
      this.rightFoliage.setX(this.sceneWidth + this.rightFoliage.displayWidth * 0.17).setAlpha(0.9);
    } else {
      this.leftFoliage.setX(-this.leftFoliage.displayWidth * 0.68).setAlpha(0);
      this.rightFoliage.setX(this.sceneWidth + this.rightFoliage.displayWidth * 0.68).setAlpha(0);
    }
  }

  private addCoverImage(key: string, depth: number): Phaser.GameObjects.Image {
    const image = this.add.image(this.sceneWidth / 2, this.sceneHeight / 2, key).setDepth(depth);
    const scale = Math.max(this.sceneWidth / image.width, this.sceneHeight / image.height);
    return image.setScale(scale);
  }

  private goToMap(): void {
    stopAmbient();
    setCurrentScene("MapScene");
    this.scene.start("MapScene");
  }
}
