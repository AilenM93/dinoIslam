import Phaser from "phaser";
import { typography } from "../typography";
import { firstMission, getMission, selectMissionForStage } from "../content";
import { getProgress, recordActivityAttempt, setCurrentScene, updateProgress } from "../progress";
import { announce, isReducedMotion } from "../settings";
import type { ReadingMission } from "../types";
import { BaseScene, palette } from "../ui";

interface MatchSelection {
  pairIndex: number;
  side: "left" | "right";
  button: Phaser.GameObjects.Container;
}

export class ReadingScene extends BaseScene {
  private wrongAnswers = 0;
  private optionButtons: Phaser.GameObjects.Container[] = [];
  private feedback?: Phaser.GameObjects.Text;
  private mission: ReadingMission = firstMission;
  private dino?: Phaser.GameObjects.Image;
  private dinoMaxWidth = 0;
  private dinoMaxHeight = 0;
  private selectedSequence: string[] = [];
  private selectedMatch?: MatchSelection;
  private matchedPairs = new Set<number>();
  private companion?: Phaser.GameObjects.Image;
  private activityObjects: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super("ReadingScene");
  }

  preload(): void {
    const mission = getMission(getProgress().selectedMissionId);
    const key = `activity-${mission.stageId}`;
    if (!this.textures.exists(key)) this.load.image(key, `/assets/${key}-v3.png`);
  }

  create(): void {
    const progress = getProgress();
    this.mission = getMission(progress.selectedMissionId);
    this.prepareScene(undefined, 0);
    setCurrentScene("ReadingScene");
    this.wrongAnswers = 0;
    this.optionButtons = [];
    this.selectedSequence = [];
    this.selectedMatch = undefined;
    this.matchedPairs.clear();
    const portrait = this.sceneHeight > this.sceneWidth;
    const panelWidth = portrait ? this.sceneWidth - 28 : Math.min(680, this.sceneWidth * 0.54);
    const panelHeight = portrait ? 470 : 500;
    const panelX = (this.sceneWidth - panelWidth) / 2;
    const panelY = Math.max(portrait ? 235 : 140, this.sceneHeight - panelHeight - 12);
    const groundY = portrait ? panelY - 8 : this.sceneHeight - 45;
    this.createEnvironment(portrait, groundY);
    this.createZoneHeader(portrait);

    this.dinoMaxWidth = portrait ? 126 : this.sceneWidth * 0.22;
    this.dinoMaxHeight = portrait ? Math.min(170, panelY - 130) : this.sceneHeight * 0.44;
    const dinoX = portrait ? this.sceneWidth * 0.25 : this.sceneWidth * 0.12;
    const companionX = portrait ? this.sceneWidth * 0.75 : this.sceneWidth * 0.88;
    for (const characterX of [dinoX, companionX]) {
      this.add.ellipse(characterX, groundY - 4, this.dinoMaxWidth * 0.68, portrait ? 16 : 24, 0x173f38, 0.2);
    }
    this.dino = this.fitImage(
      this.add.image(dinoX, groundY, "minti-listen").setOrigin(0.5, 1),
      this.dinoMaxWidth,
      this.dinoMaxHeight,
    ).setDepth(4);
    this.companion = this.fitImage(
      this.add.image(companionX, groundY, `companion-${this.mission.stageId}`).setOrigin(0.5, 1),
      this.dinoMaxWidth,
      this.dinoMaxHeight,
    ).setDepth(4);
    this.breathe(this.dino);
    this.breathe(this.companion);
    if (!isReducedMotion()) this.cameras.main.fadeIn(350, 23, 63, 56);

    const environmentObjects = new Set(this.children.list);
    this.panel(panelX, panelY, panelWidth, 96, 0.94);

    const centerX = panelX + panelWidth / 2;
    const promptY = panelY + 46;
    this.add
      .text(centerX, promptY, this.mission.prompt, {
        fontFamily: typography.body,
        fontSize: `${portrait ? 21 : 26}px`,
        fontStyle: "bold",
        color: "#173f38",
        align: "center",
        wordWrap: { width: panelWidth - 56 },
      })
      .setOrigin(0.5);

    const targetText = [this.mission.icon, this.mission.targetWord].filter(Boolean).join("  ");
    const targetFontSize = targetText.length > 12 ? (portrait ? 24 : 32) : targetText.length > 8 ? (portrait ? 30 : 42) : portrait ? 42 : 54;
    this.add.image(centerX, panelY + 145, "ui-wood-sign").setDisplaySize(panelWidth * 0.88, 82);
    this.add
      .text(centerX, panelY + 145, targetText, {
        fontFamily: typography.body,
        fontSize: `${targetFontSize}px`,
        fontStyle: "bold",
        color: "#173f38",
        align: "center",
        wordWrap: { width: panelWidth * 0.75 },
      })
      .setOrigin(0.5);

    if (this.mission.interaction === "matching") {
      this.createMatchingActivity(centerX, panelY, panelWidth, portrait);
    } else {
      this.createChoiceActivity(centerX, panelY, panelWidth, portrait);
    }

    const feedbackY = panelY + 377;
    this.panel(panelX, feedbackY - 35, panelWidth, 72, 0.94);
    this.feedback = this.add
      .text(centerX, feedbackY, this.mission.interaction === "matching" ? "Toca una tarjeta de cada lado." : "Toca una respuesta.", {
        fontFamily: typography.body,
        fontSize: `${portrait ? 16 : 19}px`,
        fontStyle: "bold",
        color: "#317565",
        align: "center",
        wordWrap: { width: panelWidth - 64 },
      })
      .setOrigin(0.5);

    this.button(centerX, panelY + 444, "🔊 Escuchar otra vez", () => {
      this.say(this.mission.spokenPrompt);
      announce(this.mission.spokenPrompt);
    }, { width: Math.min(280, panelWidth - 36), height: 50, color: palette.mint, fontSize: portrait ? 18 : 20 });
    this.activityObjects = this.children.list.filter((object) => !environmentObjects.has(object));
    const activityScaleY = Math.min(1, (this.sceneHeight - panelY - 10) / 470);
    if (activityScaleY < 1) {
      const activityLayer = this.add.container(0, panelY * (1 - activityScaleY), this.activityObjects).setScale(1, activityScaleY).setDepth(20);
      this.activityObjects = [activityLayer];
    }

    this.time.delayedCall(350, () => this.say(this.mission.spokenPrompt));
    announce(this.mission.spokenPrompt);
  }

  private createZoneHeader(portrait: boolean): void {
    this.button(64, portrait ? 32 : 38, "‹ Mapa", () => {
      setCurrentScene("MapScene");
      this.scene.start("MapScene");
    }, { width: 104, height: 44, fontSize: 18, color: palette.mint });
    const width = Math.min(this.sceneWidth - 28, 510);
    const centerY = portrait ? 98 : 85;
    this.add.image(this.sceneWidth / 2, centerY, "ui-wood-sign").setDisplaySize(width, 124).setDepth(10);
    this.add.text(this.sceneWidth / 2, centerY - 10, this.mission.area, {
      fontFamily: typography.display, fontSize: `${portrait ? 24 : 30}px`, fontStyle: "bold", color: "#173f38",
    }).setOrigin(0.5).setDepth(11);
    this.add.text(this.sceneWidth / 2, centerY + 18, this.mission.title, {
      fontFamily: typography.body, fontSize: `${portrait ? 15 : 18}px`, color: "#173f38",
    }).setOrigin(0.5).setDepth(11);
  }

  private createEnvironment(portrait: boolean, groundY: number): void {
    const key = `activity-${this.mission.stageId}`;
    const texture = this.textures.get(key);
    const source = texture.getSourceImage();
    const cover = Math.max(this.sceneWidth / source.width, this.sceneHeight / source.height);
    if (!portrait) {
      this.add.image(this.sceneWidth / 2, this.sceneHeight / 2, key).setScale(cover).setDepth(-20);
      return;
    }
    const split = Math.round(source.height * 0.6);
    if (!texture.has("scenery")) {
      texture.add("scenery", 0, 0, 0, source.width, split);
      texture.add("ground", 0, 0, split, source.width, source.height - split);
    }
    this.add.image(this.sceneWidth / 2, 0, key, "scenery").setOrigin(0.5, 0)
      .setDisplaySize(source.width * cover, groundY).setDepth(-20);
    this.add.image(this.sceneWidth / 2, groundY, key, "ground").setOrigin(0.5, 0)
      .setDisplaySize(source.width * cover, this.sceneHeight - groundY).setDepth(-20);
  }

  private createChoiceActivity(centerX: number, panelY: number, panelWidth: number, portrait: boolean): void {
    const optionY = panelY + 259;
    const choices = this.mission.interaction === "choice"
      ? Phaser.Utils.Array.Shuffle([...this.mission.choices])
      : [...this.mission.choices];
    const optionGap = Math.min(170, panelWidth / Math.max(2.7, choices.length + 0.25));
    const optionWidth = Math.min(150, panelWidth / Math.max(2.35, choices.length + 0.18));
    choices.forEach((choice, index) => {
      const offset = index - (choices.length - 1) / 2;
      const button = this.button(centerX + offset * optionGap, optionY, choice, () => this.choose(choice, button), {
        width: optionWidth,
        color: 0xfff2bf,
        skin: "wood",
        fontSize: choice.length > 8 ? (portrait ? 16 : 19) : choice.length > 3 ? (portrait ? 22 : 27) : portrait ? 36 : 44,
      });
      this.optionButtons.push(button);
    });
  }

  private createMatchingActivity(centerX: number, panelY: number, panelWidth: number, portrait: boolean): void {
    const pairs = this.mission.matchPairs ?? [];
    const leftCards = Phaser.Utils.Array.Shuffle(pairs.map((pair, pairIndex) => ({ label: pair.left, pairIndex })));
    const rightCards = Phaser.Utils.Array.Shuffle(pairs.map((pair, pairIndex) => ({ label: pair.right, pairIndex })));
    const cardWidth = Math.min(portrait ? 150 : 230, panelWidth * 0.4);
    const columnOffset = Math.min(portrait ? 88 : 155, panelWidth * 0.23);
    const firstRowY = panelY + 211;
    const rowGap = 57;

    leftCards.forEach((card, row) => {
      const button = this.button(centerX - columnOffset, firstRowY + row * rowGap, card.label, () => this.chooseMatch(card.pairIndex, "left", button), {
        width: cardWidth,
        height: 54,
        color: 0xfff2bf,
        skin: "wood",
        fontSize: card.label.length > 13 ? (portrait ? 13 : 16) : card.label.length > 7 ? (portrait ? 16 : 19) : portrait ? 20 : 24,
      });
      this.optionButtons.push(button);
    });
    rightCards.forEach((card, row) => {
      const button = this.button(centerX + columnOffset, firstRowY + row * rowGap, card.label, () => this.chooseMatch(card.pairIndex, "right", button), {
        width: cardWidth,
        height: 54,
        color: 0xd9f3d8,
        skin: "leaf",
        fontSize: card.label.length > 13 ? (portrait ? 13 : 16) : card.label.length > 7 ? (portrait ? 16 : 19) : portrait ? 20 : 24,
      });
      this.optionButtons.push(button);
    });
  }

  private choose(choice: string, button: Phaser.GameObjects.Container): void {
    if (this.mission.interaction === "sequence") {
      this.chooseSequence(choice, button);
      return;
    }
    if (choice === this.mission.answer) {
      this.correct(button);
      return;
    }

    this.wrongAnswers += 1;
    recordActivityAttempt(this.mission, false, Math.min(2, this.wrongAnswers));
    this.say(this.mission.retry);
    announce(this.mission.retry);
    if (this.feedback) {
      this.feedback.setText(this.wrongAnswers >= 2 ? `${this.mission.retry}\n${this.mission.hint}` : this.mission.retry);
      this.feedback.setColor("#b45043");
    }
    if (!isReducedMotion()) {
      this.tweens.add({ targets: button, x: "+=10", duration: 65, yoyo: true, repeat: 3 });
    }
    if (this.wrongAnswers >= 2) {
      const extraWrong = this.optionButtons.find((item) => item !== button && item.getAt(2) instanceof Phaser.GameObjects.Text && (item.getAt(2) as Phaser.GameObjects.Text).text !== this.mission.answer);
      if (extraWrong) extraWrong.setAlpha(0.28).disableInteractive();
    }
  }

  private chooseSequence(choice: string, button: Phaser.GameObjects.Container): void {
    const answer = this.mission.sequenceAnswer ?? [];
    this.selectedSequence.push(choice);
    button.disableInteractive().setAlpha(0.48);
    this.feedback?.setText(this.selectedSequence.join("  +  ")).setColor("#317565");
    if (this.selectedSequence.length < answer.length) return;

    const isCorrect = answer.every((part, index) => part === this.selectedSequence[index]);
    if (isCorrect) {
      this.correct(button);
      return;
    }

    this.wrongAnswers += 1;
    recordActivityAttempt(this.mission, false, Math.min(2, this.wrongAnswers));
    this.say(this.mission.retry);
    announce(this.mission.retry);
    this.feedback
      ?.setText(this.wrongAnswers >= 2 ? `${this.mission.retry}\n${this.mission.hint}` : this.mission.retry)
      .setColor("#b45043");
    this.time.delayedCall(650, () => {
      this.selectedSequence = [];
      this.optionButtons.forEach((option) => option.setAlpha(1).setInteractive({ useHandCursor: true }));
      this.feedback?.setText("Inténtalo otra vez, desde el comienzo.").setColor("#317565");
    });
  }

  private chooseMatch(pairIndex: number, side: "left" | "right", button: Phaser.GameObjects.Container): void {
    if (this.matchedPairs.has(pairIndex)) return;
    if (!this.selectedMatch || this.selectedMatch.side === side) {
      this.selectedMatch?.button.setScale(1);
      this.selectedMatch = { pairIndex, side, button };
      button.setScale(1.06);
      this.feedback?.setText(side === "left" ? "Ahora busca su pareja a la derecha." : "Ahora busca su pareja a la izquierda.").setColor("#317565");
      return;
    }

    const previous = this.selectedMatch;
    this.selectedMatch = undefined;
    if (previous.pairIndex === pairIndex) {
      this.matchedPairs.add(pairIndex);
      previous.button.setScale(1).setAlpha(0.4).disableInteractive();
      button.setScale(1).setAlpha(0.4).disableInteractive();
      const totalPairs = this.mission.matchPairs?.length ?? 0;
      this.feedback?.setText(`${this.matchedPairs.size} de ${totalPairs} parejas encontradas.`).setColor("#23735e");
      if (this.matchedPairs.size === totalPairs) this.correct(button);
      return;
    }

    this.wrongAnswers += 1;
    recordActivityAttempt(this.mission, false, Math.min(2, this.wrongAnswers));
    this.say(this.mission.retry);
    announce(this.mission.retry);
    this.feedback
      ?.setText(this.wrongAnswers >= 2 ? `${this.mission.retry}\n${this.mission.hint}` : this.mission.retry)
      .setColor("#b45043");
    if (!isReducedMotion()) {
      this.tweens.add({ targets: [previous.button, button], x: "+=8", duration: 65, yoyo: true, repeat: 2 });
    }
    this.time.delayedCall(420, () => {
      previous.button.setScale(1);
      button.setScale(1);
    });
  }

  private correct(button: Phaser.GameObjects.Container): void {
    this.optionButtons.forEach((option) => option.disableInteractive());
    button.setScale(1.08);
    const progress = recordActivityAttempt(this.mission, true, Math.min(2, this.wrongAnswers));
    const rune = progress.runes[this.mission.stageId];
    const rewardMessage = rune.stage === "radiant"
      ? `¡Despertaste la ${this.mission.reward.name.toLowerCase()}!`
      : `Encontraste el fragmento ${rune.fragments} de 3 de la ${this.mission.reward.name.toLowerCase()}.`;
    this.say(`${this.mission.success} ${rewardMessage}`);
    announce(`Respuesta correcta. ${rewardMessage}`);
    if (this.feedback) this.feedback.setText(this.mission.success).setColor("#23735e");
    this.celebrateMinti();
    this.confetti(button.x, button.y);
    this.time.delayedCall(500, () => {
      this.activityObjects.forEach((object) => object.destroy());
      this.activityObjects = [];
      this.feedback = undefined;
      this.fitImage(this.add.image(this.sceneWidth / 2, this.sceneHeight * 0.47, this.mission.reward.assetKey), 130, 150);
      this.toast(`${this.mission.reward.symbol} ${rewardMessage}`, this.mission.reward.color);
      const compact = this.sceneWidth < 520;
      this.button(compact ? this.sceneWidth * 0.27 : this.sceneWidth / 2 - 175, this.sceneHeight - 154, "Otra actividad", () => {
        const current = getProgress();
        const nextMission = selectMissionForStage(this.mission.stageId, current.attemptHistory);
        updateProgress({ selectedMissionId: nextMission.id });
        this.scene.restart();
      }, { width: compact ? 170 : 250, color: palette.mint, fontSize: compact ? 17 : 21, depth: 90 });
      this.button(compact ? this.sceneWidth * 0.74 : this.sceneWidth / 2 + 175, this.sceneHeight - 154, "Ver runas", () => {
        setCurrentScene("RefugeScene");
        this.scene.start("RefugeScene");
      }, { width: compact ? 160 : 250, color: palette.coral, skin: "wood", fontSize: compact ? 18 : 22, depth: 90 });
    });
  }

  private celebrateMinti(): void {
    if (!this.dino) return;
    this.tweens.killTweensOf(this.dino);
    const dino = this.dino;
    const revealPose = (): void => {
      dino.setTexture("minti-celebrate");
      this.fitImage(dino, this.dinoMaxWidth, this.dinoMaxHeight);
      dino.setAlpha(1).setAngle(0);
      if (isReducedMotion()) return;
      const baseY = dino.y;
      this.tweens.add({
        targets: dino,
        y: baseY - 22,
        angle: -4,
        duration: 190,
        ease: "Quad.Out",
        yoyo: true,
        repeat: 1,
      });
    };
    if (isReducedMotion()) {
      revealPose();
      return;
    }
    this.tweens.add({ targets: dino, alpha: 0.2, duration: 90, onComplete: revealPose });
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
