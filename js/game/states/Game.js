ProyectoFinal.Game = function() {
  this.playerMinAngle = -20;
  this.playerMaxAngle = 20;
  
  this.score = 0;
  this.level = 1;
  this.lives = 4;
  this.previousCoinType = null;
    
  this.coinRate = 1000;
  this.coinTimer = 0;

  this.enemyRate = 500;
  this.enemyTimer = 0;

  this.coinSpawnX = null;
  this.coinSpacingX = 10;
  this.coinSpacingY = 10;
};

ProyectoFinal.Game.prototype = {
  create: function() {

    this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-100, 0);

    //this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
    //this.foreground.autoScroll(-100,0);

    this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
    this.ground.autoScroll(-400, 0);

    this.player = this.add.sprite(200, this.game.height/2, 'player');
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.3);

    this.player.animations.add('fly', [0,1,2,3,2,1]);
    this.player.animations.play('fly', 8, true);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;

    this.game.physics.arcade.enableBody(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.game.physics.arcade.enableBody(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.bounce.set(0.25);

    this.coins = this.game.add.group();
    this.enemies = this.game.add.group();

    this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Puntos: 0', 24);
    this.levelText = this.game.add.bitmapText(10,50, 'minecraftia', 'Nivel: 1', 24);
    this.livesText = this.game.add.bitmapText(10,90, 'minecraftia', 'Vidas: 4', 24);

    this.jetSound = this.game.add.audio('rocket');
    this.coinSound = this.game.add.audio('coin');
    this.deathSound = this.game.add.audio('death');
    this.gameMusic = this.game.add.audio('gameMusic');
    this.gameMusic2 = this.game.add.audio('gameMusic2');
    this.gameMusic3 = this.game.add.audio('gameMusic3');
    this.gameMusic4 = this.game.add.audio('gameMusic4');
    this.gameMusic.play('', 0, true);

    this.coinSpawnX = this.game.width + 64;
},
  update: function() {
    if(this.game.input.activePointer.isDown) {
      this.player.body.velocity.y -= 25;
      if(!this.jetSound.isPlaying) {
        this.jetSound.play('', 0, true, 0.5);
      } 
    } else {
      this.jetSound.stop();
    }

    if( this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
      if(this.player.angle > 0) {
        this.player.angle = 0;
      }
      if(this.player.angle > this.playerMinAngle) {
        this.player.angle -= 0.5;
      }
    } else if(this.player.body.velocity.y >=0 && !this.game.input.activePointer.idDown) {
      if(this.player.angle < this.playerMaxAngle) {
        this.player.angle += 0.5;
      }
    }

    if(this.coinTimer < this.game.time.now) {
      this.generateCoins();
      this.coinTimer = this.game.time.now + this.coinRate;
    }

    if(this.enemyTimer < this.game.time.now) {
      this.createEnemy();
      this.enemyTimer = this.game.time.now + this.enemyRate;
    }


    this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
      
      
    this.enemies.setAll('body.velocity.x', -400*(1+this.level/2));
    this.coins.setAll('body.velocity.x', -400*(1+this.level/2));

  },
  shutdown: function() {
    this.coins.destroy();
    this.enemies.destroy();
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.coinTimer = 0;
    this.enemyTimer = 0;
  },
  createCoin: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var coin = this.coins.getFirstExists(false);
    if(!coin) {
      coin = new Coin(this.game, 0, 0);
      this.coins.add(coin);
    }

    coin.reset(x, y);
    coin.revive();
    return coin;
  },
  generateCoins: function() {
    if(!this.previousCoinType || this.previousCoinType < 3) {
      var coinType = this.game.rnd.integer() % 5;
      switch(coinType) {
        case 0:
          //do nothing. No coins generated
          break;
        case 1:
        case 2:
          // if the cointype is 1 or 2, create a single coin
          //this.createCoin();
          this.createCoin();

          break;
        case 3:
          // create a small group of coins
          this.createCoinGroup(2, 2);
          break;
        case 4:
          //create a large coin group
          this.createCoinGroup(6, 2);
          break;
        default:
          // if somehow we error on the cointype, set the previouscointype to zero and do nothing
          this.previousCoinType = 0;
          break;
      }

      this.previousCoinType = coinType;
    } else {
      if(this.previousCoinType === 4) {
        // the previous coin generated was a large group, 
        // skip the next generation as well
        this.previousCoinType = 3;
      } else {
        this.previousCoinType = 0;  
      }
      
    }
  },
  createCoinGroup: function(columns, rows) {
    //create 4 coins in a group
    var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
    var coinRowCounter = 0;
    var coinColumnCounter = 0;
    var coin;
    for(var i = 0; i < columns * rows; i++) {
      coin = this.createCoin(this.spawnX, coinSpawnY);
      coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
      coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
      coinColumnCounter++;
      if(i+1 >= columns && (i+1) % columns === 0) {
        coinRowCounter++;
        coinColumnCounter = 0;
      } 
    }
  },


  createEnemy: function() {
    var x = this.game.width;
    var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

    var enemy = this.enemies.getFirstExists(false);
    if(!enemy) {
        enemy = new Enemy(this.game, 0, 0);
        this.enemies.add(enemy);
    }
    enemy.reset(x, y);
    enemy.revive();
  },
  groundHit: function(player, ground) {
    player.body.velocity.y = -200;
  },
  coinHit: function(player, coin) {
    this.score++;
    if (this.score == this.level * 10) {
        this.level++;
        this.lives++;
    
        this.levelText.text = 'Dificultad: ' + this.level;
        this.livesText.text = 'Vidas: ' + this.lives;
        
        if (this.level == 2) {
            this.gameMusic.stop();
            this.gameMusic2.play('', 0, true);
            this.background.loadTexture('background2');
        } else if (this.level == 3) {
            this.gameMusic2.stop();
            this.gameMusic3.play('', 0, true);
            this.background.loadTexture('background3');
        } else if (this.level == 4) {
            this.gameMusic3.stop();
            this.gameMusic4.play('', 0, true);
            this.background.loadTexture('background4');
        }
        
        this.enemies.forEach(function (e) { e.kill(); });
    }
      
    this.coinSound.play();
    coin.kill();

    var dummyCoin = new Coin(this.game, coin.x, coin.y);
    this.game.add.existing(dummyCoin);

    dummyCoin.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyCoin).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyCoin.destroy();
      this.scoreText.text = 'Puntos: ' + this.score;
    }, this);

  },
  enemyHit: function(player, enemy) {
    this.lives--;
    this.livesText.text = 'Vidas: ' + this.lives;
    this.deathSound.play();
    enemy.kill();

    if (this.lives == 0) {
        player.kill();
        this.gameMusic.stop();
        this.gameMusic2.stop();
        this.gameMusic3.stop();
        this.gameMusic4.stop();

        this.ground.stopScroll();
        this.background.stopScroll();
        //this.foreground.stopScroll();

        this.enemies.setAll('body.velocity.x', 0);
        this.coins.setAll('body.velocity.x', 0);

        this.enemyTimer = Number.MAX_VALUE;
        this.coinTimer = Number.MAX_VALUE;

        var scoreboard = new Scoreboard(this.game);
        scoreboard.show(this.score);
    }
  }
};