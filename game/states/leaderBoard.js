
'use strict';
var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');
function LeaderBoard() {}

LeaderBoard.prototype = {
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

    // this.menuBG = this.game.add.graphics(50,50);
    // this.menuBG.lineStyle(2, 0xFFFFFF, 1);
    // this.menuBG.beginFill(0x1f1544, 1);
    // this.menuBG.drawRect( this.background.menuWidth, this.game.height/100, 250, 250);


    this.charSelText = this.game.add.bitmapText( (this.game.width/2) - 105 ,70 , 'mainFont',"Select Your Character", 20);



    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

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

    this.gplayBG = this.game.add.graphics(50,50);
    this.gplayBG.lineStyle(2, 0xFFFFFF, 1);
    this.gplayBG.beginFill(0x1f1544, 1);
    this.gplayBG.drawRect( this.background.menuWidth, (this.game.height/100)+ 275, 250, 50);

    this.gplayBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, 'gplayBtn', this.gplayClick, this);
    this.gplayBtn.anchor.setTo(0.5,0.5);



    // this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.charClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
  },
  gplayClick: function() {
    window.game.submitScore(leaderboardId, score);
    window.game.showLeaderboard(leaderboardId);
  }
};

module.exports = LeaderBoard;
