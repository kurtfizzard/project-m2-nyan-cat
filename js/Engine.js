// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // Create a scoreboard, a new text object
    this.scoreboard = new Text(this.root, 20, 585);
    // The score will equal 0 by default
    this.score = 0;
    // Function to call the text update when the score changes
    this.scoreboard.update(`Score:${this.score}`);
    // Create a life count, a new text object
    this.lifeCount = new Text(this.root, 390, 585);
    // The lives will start at 3
    this.lives = 3;
    // Function to call the text update when the lives change
    this.lifeCount.update(`Life:${this.lives}`);
    // Create a variable for an audio clip to play on contact with the enemy
    this.meow = new Audio("./audio/meow.wav");

    this.burp = new Audio("./audio/burp.mp3");

    // We add the background image to the game
    addBackground(this.root);
    // Debounce to neutralize the collision effect on first collision
    this.debouncedDecrementLives = _.debounce(
      this.decrementLives.bind(this),
      25
    );
    this.bonuses = [];

    this.debouncedIncrementLives = _.debounce(
      this.incrementLives.bind(this),
      50
    );
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.destroyed === true) {
        this.score += 1;
        this.scoreboard.update(`Score:${this.score}`);
      }
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.bonuses.forEach((bonus) => {
      bonus.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.bonuses = this.bonuses.filter((bonus) => {
      return !bonus.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.bonuses.length < MAX_BONUSES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextBonusSpot(this.bonuses);
      this.bonuses.push(new Bonus(this.root, spot));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      GAME_ON = false;
      const GAME_OVER_ALERT = document.createElement("button");
      GAME_OVER_ALERT.innerText = "GAME OVER";
      GAME_OVER_ALERT.style.background = "red";
      GAME_OVER_ALERT.style.border = "none";
      GAME_OVER_ALERT.style.font = "bold 40px Monospace";
      GAME_OVER_ALERT.style.position = "absolute";
      GAME_OVER_ALERT.style.height = "100px";
      GAME_OVER_ALERT.style.top = "300px";
      GAME_OVER_ALERT.style.width = "300px";
      GAME_OVER_ALERT.style.zIndex = "500";
      body.append(GAME_OVER_ALERT);
      GAME_OVER_ALERT.addEventListener("mousedown", () => {
        GAME_OVER_ALERT.style.display = "none";
        document.location.reload(true);
      });
      // window.alert("GAME OVER");
      return;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  decrementLives = () => {
    this.lives = this.lives - 1;
    this.lifeCount.update(`Life:${this.lives}`);
  };

  incrementLives = () => {
    this.lives = this.lives + 1;
    this.lifeCount.update(`Life:${this.lives}`);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    let gameOver = false;
    this.enemies.forEach((enemy) => {
      let catEnemy = enemy;
      catEnemy.width = ENEMY_WIDTH;
      catEnemy.height = ENEMY_HEIGHT;
      let burgerPlayer = this.player;
      burgerPlayer.width = PLAYER_WIDTH;
      burgerPlayer.height = PLAYER_HEIGHT;
      if (this.lives === 0) {
        gameOver = true;
      } else if (
        catEnemy.x < burgerPlayer.x + burgerPlayer.width &&
        catEnemy.x + catEnemy.width > burgerPlayer.x &&
        catEnemy.y < burgerPlayer.y + burgerPlayer.height &&
        catEnemy.y + catEnemy.height > burgerPlayer.y
      ) {
        console.log("************* COLLISION *************");
        // decrement lives by one
        this.debouncedDecrementLives();
        // play the cat audio clip
        this.meow.play();
      }
    });
    this.bonuses.forEach((bonus) => {
      let sauceBonus = bonus;
      sauceBonus.width = BONUS_WIDTH;
      sauceBonus.height = BONUS_HEIGHT;
      let burgerPlayer = this.player;
      burgerPlayer.width = PLAYER_WIDTH;
      burgerPlayer.height = PLAYER_HEIGHT;
      if (
        sauceBonus.x < burgerPlayer.x + burgerPlayer.width &&
        sauceBonus.x + sauceBonus.width > burgerPlayer.x &&
        sauceBonus.y < burgerPlayer.y + burgerPlayer.height &&
        sauceBonus.y + sauceBonus.height > burgerPlayer.y
      ) {
        this.debouncedIncrementLives();
        this.burp.play();
      }
    });
    return gameOver;
  };
}
