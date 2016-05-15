'use strict';

var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    // add the background sprite
    this.background = this.game.add.tileSprite(0,0, 288, 505, 'background');
    this.background.autoScroll(-2.5,-10);
    
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

    // this.menuBG = this.game.add.graphics(50,50);
    // this.menuBG.lineStyle(2, 0x1f1544, 1);
    // this.menuBG.beginFill(0xFFFFFF, 1);
    // this.menuBG.drawRect(-20,this.game.height/100, this.game.width - 40, this.game.height/1.5);
    

    /** STEP 1 **/
    // create a group to put the title assets in 
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()
      
    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(0,0,'medusasTitle');
    // this.title.width = (this.title.width/3) ;
    // this.title.height = (this.title.height/3) ;
    this.titleGroup.add(this.title);

    /** STEP 3 **/
    // create the bird sprite 
    // and add it to the title group
    //this.bird = this.add.sprite(200,5,'bird');
    //this.titleGroup.add(this.bird);
    
    /** STEP 4 **/
    // add an animation to the bird
    // and begin the animation
    //this.bird.animations.add('flap');
    //this.bird.animations.play('flap', 12, true);
    
    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 2000, true);

    // add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);
    //this.titleGroup.add(this.startButton);
  },
  startClick: function() {
    // start button click handler
    // start the 'play' state
    this.game.state.start('charSelect');
  }
};

module.exports = Menu;
