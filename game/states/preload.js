
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.game.load.script('plasma', 'assets/filters/Plasma.js');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('background', 'assets/background/spaceBG_2.png');
    this.load.image('mountains', 'assets/background/Mountains_v5.png');
    this.load.image('mountains_2', 'assets/background/mountains_2.png');
    this.load.image('snowHill', 'assets/background/snowHills.png');
    this.load.image('fog', 'assets/background/fog_v3.png');
    this.load.image('ground', 'assets/Ground_01.png');
    this.load.spritesheet('platform', 'assets/platform_ice_1.png', 181,23,1);
    this.load.image('soundOff', 'assets/sound/sound_mute.png');
    this.load.image('soundOn', 'assets/sound/sound_high.png');
    this.load.spritesheet('soundSprite', 'assets/sound/soundSprite.png');

    // menu.js assets\
    this.load.image('medusasTitle', 'assets/menuImages/MD.png');
    this.load.image('startButton', 'assets/menuImages/start-button_v2.png');

    // charSelect.js assets
    this.load.image('instructions', 'assets/menuImages/instructions_v2.png');
    this.load.image('getReady', 'assets/menuImages/get-ready_1.png');
    this.load.image('back', 'assets/menuImages/back.png');

    this.load.image('scoreboard', 'assets/menuImages/scoreboard_v3.png');
    this.load.spritesheet('discoBall', 'assets/chars/discoBall_v3.png',30, 30, 8);
    this.load.image('gameover', 'assets/menuImages/gameover_1.png');


    // CharSelect assets
    this.load.image('robinBtn', 'assets/chars/charButton_RobinBtn.png');
    this.load.image('wyntonBtn', 'assets/chars/charButton_WyntonBtn.png');
    this.load.image('hunterBtn', 'assets/chars/charButton_HunterBtn.png');
    this.load.image('tylerBtn', 'assets/chars/charButton_TylerBtn.png');
    this.load.image('alexBtn', 'assets/chars/charButton_AlexBtn.png');
    this.load.image('characterSelectSheet', 'assets/chars/characterSelectSheet.png');
    this.load.spritesheet('characterSpriteSheet', 'assets/chars/characterSpriteSheetFinal.png', 32,32,30);


    this.load.spritesheet('enemy', 'assets/chars/medusa.png', 32,32,6);
    //this.load.spritesheet('skyEnemy', 'assets/enemySky.png', 34,24,3);
    this.load.spritesheet('skyEnemy', 'assets/chars/snakes.png', 31+1/3,20,12);


    // Sound files
    this.load.audio('jump', 'assets/sound/flap.wav');
    this.load.audio('pipeHit', 'assets/sound/pipe-hit.wav');
    this.load.audio('groundHit', 'assets/sound/ground-hit.wav');
    this.load.audio('score', 'assets/sound/score.wav');
    this.load.audio('ouch', 'assets/sound/ouch.wav');
    this.load.audio('discoBall', 'assets/sound/discoBall.wav');

    this.load.bitmapFont('mainFont', 'assets/fonts/gem/gem.png', 'assets/fonts/gem/gem.xml');
    this.load.bitmapFont('nokiaFont', 'assets/fonts/nokia/nokia16.png', 'assets/fonts/nokia/nokia16.xml');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
