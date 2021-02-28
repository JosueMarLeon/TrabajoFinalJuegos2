ProyectoFinal.Preload = function() {
  this.ready = false;
};

ProyectoFinal.Preload.prototype = {
  preload: function() {

    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('ground', 'assets/images/groundalt.png');
    this.load.image('background', 'assets/images/view_of_greenock_scotland.jpg');
    this.load.image('background2', 'assets/images/edinburgh_castle_scotland.jpg');
    this.load.image('background3', 'assets/images/landscape-with-tourists-at-loch-katrin.jpg');
    this.load.image('background4', 'assets/images/RembrandtNGS.jpg');
    //this.load.image('foreground', 'assets/images/groundalt.png');

    this.load.spritesheet('coins', 'assets/images/angel-spritesheet.png', 361, 361, 7);
    this.load.spritesheet('player', 'assets/images/jetpack-ps.png', 229, 296, 4);
    this.load.spritesheet('missile', 'assets/images/demon-spritesheet.png', 361, 361, 4);

    this.load.audio('gameMusic', ['assets/audio/Cullah - The Grief of Ceridwen.mp3', 'assets/audio/Cullah - The Grief of Ceridwen.ogg']);
    this.load.audio('gameMusic2', ['assets/audio/sawsquarenoise - Valiesse.mp3', 'assets/audio/sawsquarenoise - Valiesse.ogg']);
    this.load.audio('gameMusic3', ['assets/audio/sawsquarenoise - Bello Alcazar.mp3', 'assets/audio/sawsquarenoise - Bello Alcazar.ogg']);
    this.load.audio('gameMusic4', ['assets/audio/Guifrog - Beyond the Warriors.mp3', 'assets/audio/Guifrog - Beyond the Warriors.ogg']);
    this.load.audio('rocket', 'assets/audio/rocket.wav');
    this.load.audio('bounce', 'assets/audio/bounce.wav');
    this.load.audio('coin', 'assets/audio/coin.wav');
    this.load.audio('death', 'assets/audio/death.wav');

    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

    this.load.onLoadComplete.add(this.onLoadComplete, this);
  },
  create: function() {
    this.preloadBar.cropEnabled = false;
  }, 
  update: function() {
    if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
      this.state.start('MainMenu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};