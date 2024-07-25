import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
    this.moveLeft = false;
    this.moveRight = false;
  }

  preload() {
    // Load medias
    this.load.image("bg", "assets/bg.png");
    this.load.image("basket", "assets/basket.png");
    this.load.image("apple", "assets/apple.png");
    this.load.image("money", "assets/money.png");
    this.load.audio("coin", "assets/coin.mp3");
    this.load.audio("bgMusic", "assets/bgMusic.mp3");
  }

  create() {
    this.scene.pause("scene-game");

    // Sounds
    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("bgMusic");
    this.bgMusic.play();

    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Player props
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(
      this.player.width - this.player.width / 4,
      this.player.height / 6
    );

    // Apple props
    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);

    // Add collider apple with basket
    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );

    // Cursor
    this.cursor = this.input.keyboard.createCursorKeys();

    // Text
    this.textScore = this.add.text(sizes.width - 120, 10, "Pontos: 0", {
      font: "bold 20px Arial",
      fill: "white",
      backgroundColor: "#0075CD",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
      stroke: "black",
      strokeThickness: 3,
      shadow: {
        offsetY: 2,
        color: "#000000",
        blur: 2,
        stroke: true,
        fill: true,
      },
    });

    this.textTime = this.add.text(10, 10, "Tempo Restante: 00", {
      font: "bold 20px Arial",
      fill: "white",
      backgroundColor: "#0075CD",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
      stroke: "black",
      strokeThickness: 3,
      shadow: {
        offsetY: 2,
        color: "#000000",
        blur: 2,
        stroke: true,
        fill: true,
      },
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });

    this.emitter.startFollow(
      this.player,
      this.player.width / 2,
      this.player.height / 2,
      true
    );
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Tempo Restante: ${Math.round(this.remainingTime).toString()}s`
    );

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    // Cursor
    const { left, right } = this.cursor;

    if (left.isDown || this.moveLeft) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown || this.moveRight) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    // Control Buttons
    controlLeftButton.addEventListener("mousedown", () => {
      this.moveLeft = true;
    });

    controlLeftButton.addEventListener("mouseup", () => {
      this.moveLeft = false;
    });

    controlRightButton.addEventListener("mousedown", () => {
      this.moveRight = true;
    });

    controlRightButton.addEventListener("mouseup", () => {
      this.moveRight = false;
    });
  }

  getRandomX() {
    return Math.floor(Math.random() * 400);
  }

  targetHit() {
    this.coinMusic.play();
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Pontos: ${this.points}`);

    if (this.points == 10) {
      this.gameOver();
    }
  }

  gameOver() {
    this.sys.game.destroy(true);

    if (this.points >= 10) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Ganhou! 😊";
    } else {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Perdeu! 😢";
    }

    gameEndDiv.style.display = "flex";
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});
