var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.state.add('Boot', ProyectoFinal.Boot);
game.state.add('Preloader', ProyectoFinal.Preload);
game.state.add('MainMenu', ProyectoFinal.MainMenu);
game.state.add('Game', ProyectoFinal.Game);

game.state.start('Boot');