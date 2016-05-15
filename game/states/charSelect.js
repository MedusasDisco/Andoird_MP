
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

    this.background = this.game.add.tileSprite(0,0, 288, 505, 'background');
    this.background.autoScroll(-2.5,-5);

    this.fog = new Fog(this.game, 0, this.game.height-210, 663, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.height-290, 663, 146);
    this.game.add.existing(this.mountains2);

    this.snowHill = new SnowHill(this.game, 0, this.game.height-260, 663, 146);
    this.game.add.existing(this.snowHill);

    this.mountains = new Mountains(this.game, 0, this.game.height-235, 576, 130);
    this.game.add.existing(this.mountains);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,400, 335,112,'ground');
    this.ground.autoScroll(-200,0);
    
    this.menuBG = this.game.add.graphics(50,50);
    this.menuBG.lineStyle(2, 0xFFFFFF, 1);
    this.menuBG.beginFill(0x1f1544, 1);
    this.menuBG.drawRect(-30,this.game.height/100, this.game.width - 40, this.game.height/2);


    this.charSelText = this.game.add.bitmapText(40,70 , 'mainFont',"Select Your Character", 20);
    


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
    this.titleGroup.x = 30;
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



    // this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.charClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
  },
  hunterClick: function() {
    this.game.humanSpriteSheet = "hunter";
    this.game.state.start('play');
  },
  alexClick: function() {
    this.game.humanSpriteSheet = "alexInst";
    this.game.state.start('play');
  },
  tylerClick: function() {
    this.game.humanSpriteSheet = "tyler";
    this.game.state.start('play');
  },
  wyntonClick: function() {
    this.game.humanSpriteSheet = "wynton";
    this.game.state.start('play');
  },
  robinClick: function() {
    this.game.humanSpriteSheet = "robin";
    this.game.state.start('play');
  }
};

module.exports = CharSel;
