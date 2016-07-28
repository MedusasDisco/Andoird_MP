'use strict';


var BootState = require('./states/boot');
var CharSelectState = require('./states/charSelect');
var LeaderBoardState = require('./states/leaderBoard');
var MenuState = require('./states/menu');
var PlayState = require('./states/play');
var PreloadState = require('./states/preload');

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'medusas-pixel');

// Game States
game.state.add('boot', BootState);
game.state.add('charSelect', CharSelectState);
game.state.add('leaderBoard', LeaderBoardState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('preload', PreloadState);


game.state.start('boot');
