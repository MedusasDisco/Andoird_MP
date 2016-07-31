
'use strict';
var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');
function CharSel() {}

CharSel.prototype = {
  preload: function() {

  },
  create: function() {

    this.background = this.game.add.tileSprite(0,0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-2.5,-5);
    this.background.menuWidth = (this.game.width / 2) - 180;

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, this.game.width, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, this.game.width, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, this.game.width, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, this.game.width, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, this.game.width, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,this.game.backgroundPos.ground, this.game.width,112,'ground');
    this.ground.autoScroll(-200,0);

    this.menuBG = this.game.add.graphics(50,50);
    this.menuBG.lineStyle(2, 0xFFFFFF, 1);
    this.menuBG.beginFill(0x1f1544, 1);
    this.menuBG.drawRect( this.background.menuWidth, this.game.height/100, 250, 250);


    this.charSelText = this.game.add.bitmapText( (this.game.width/2) - 105 ,70 , 'mainFont',"Select Your Character", 20);
    this.setUnlockedText();


    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

    this.game.humanSpriteSheet = "tyler";
    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(0,0,'characterSelectSheet');
    this.titleGroup.add(this.title);


    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = (this.game.width / 2) - 110;
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 2000, true);

    // add our start button with a callback
    this.hunterButton = this.game.add.button(this.game.width/2+10, 120, 'hunterBtn', this.hunterClick, this);
    this.hunterButton.anchor.setTo(0.5,0.5);


    this.alexButton = this.game.add.button(this.game.width/2+10, 155, 'alexBtn', this.alexClick, this);
    this.alexButton.anchor.setTo(0.5,0.5);


    this.tylerButton = this.game.add.button(this.game.width/2+10, 190, 'tylerBtn', this.tylerClick, this);
    this.tylerButton.anchor.setTo(0.5,0.5);


    this.wyntonButton = this.game.add.button(this.game.width/2+10, 225, 'wyntonBtn', this.wyntonClick, this);
    this.wyntonButton.anchor.setTo(0.5,0.5);


    this.robinButton = this.game.add.button(this.game.width/2+10, 260, 'robinBtn', this.robinClick, this);
    this.robinButton.anchor.setTo(0.5,0.5);


    this.musicBtnBG = this.game.add.graphics(50,50);
    this.musicBtnBG.lineStyle(2, 0xFFFFFF, 1);
    this.musicBtnBG.beginFill(0x1f1544, 1);
    this.musicBtnBG.drawRect( this.background.menuWidth, (this.game.height/100)+ 275, 250, 50);
    this.setMusicBtn();
    //
    // this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, 'musicOff', this.musicOff, this);
    // this.musicBtn.anchor.setTo(0.5,0.5);

    // this.musicOnBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 380, 'musicOn', this.musicOn, this);
    // this.musicOnBtn.anchor.setTo(0.5,0.5);


    // this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.charClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
  },
  hunterClick: function() {
    this.game.humanSpriteSheet = "hunter";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -400;
    this.game.scoreLabel = 0xf46f70;
    this.game.state.start('play');
  },
  alexClick: function() {
    this.game.humanSpriteSheet = "alexInst";
    this.game.jumpsLeft = 4;
    this.game.velocityY = -380;
    this.game.scoreLabel = 0xF4B06F;
    this.game.state.start('play');
  },
  tylerClick: function() {
    this.game.humanSpriteSheet = "tyler";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -440;
    this.game.scoreLabel = 0x6FF4F3;
    this.game.state.start('play');
  },
  wyntonClick: function() {
    this.game.humanSpriteSheet = "wynton";
    this.game.jumpsLeft = 2;
    this.game.velocityY = -550;
    this.game.scoreLabel = 0x6FF470;
    this.game.state.start('play');
  },
  robinClick: function() {
    this.game.humanSpriteSheet = "robin";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -420;
    this.game.scoreLabel = 0x706FF4;
    this.game.state.start('play');
  },
  setUnlockedText: function(){
    if(!!localStorage) {
        this.bestScore = localStorage.getItem('bestScore') || 0;
    }
    if(this.bestScore > 500){
      this.unlockedText = this.game.add.bitmapText( (this.game.width/2) - 90 , 5 , 'mainFont',"Unlocked album at", 20);
      this.unlockedWebText = this.game.add.bitmapText( (this.game.width/2) - 105 , 25 , 'mainFont',"MedusasDisco.com/8bit", 20);
      this.unlockedText.tint = 0xf46f70;
      this.unlockedWebText.tint = 0xf46f70;
    }
  },
  setMusicBtn: function(){
    musicPlaying ?  this.musicButtonState = 'musicOn': this.musicButtonState = 'musicOff';

    this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, this.musicButtonState, this.toggleMusic, this);
    this.musicBtn.anchor.setTo(0.5,0.5);
  },
  toggleMusic: function(){

    this.musicBtn.destroy();

    musicPlaying = !musicPlaying;

    if (!musicPlaying){
        soundTrack.stop();
        this.musicButtonState = 'musicOff'
    } else {
        soundTrack.play({numberOfLoops: 100,playAudioWhenScreenIsLocked: false});
        this.musicButtonState = 'musicOn';
    }
    this.game.musicPlaying = musicPlaying;

    this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, this.musicButtonState, this.toggleMusic, this);
    this.musicBtn.anchor.setTo(0.5,0.5);
  }
};

module.exports = CharSel;
