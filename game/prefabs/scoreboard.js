'use strict';

var Scoreboard = function(game) {

  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  // this.scoreboard = this.game.add.graphics(50,50);
  // this.scoreboard.lineStyle(2, 0xFFFFFF, 1);
  // this.scoreboard.beginFill(0x1f1544, 1);
  // this.scoreboard.drawRect(-30,this.game.height/100, this.game.width - 40, this.game.height/2);

  this.scoreText = this.game.add.bitmapText((this.game.width/2), 160, 'mainFont', '', 18);
  this.add(this.scoreText);

  this.bestText = this.game.add.bitmapText((this.game.width/2), 215, 'mainFont', '', 18);
  this.add(this.bestText);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width/2 + 60, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  this.add(this.startButton);

  this.backButton = this.game.add.button((this.game.width/2)- 60, 300, 'back', this.goToCharSel, this);
  this.backButton.anchor.setTo(0.5,0.5);
  this.add(this.backButton);


  this.y = 0;//this.game.height;v
  this.x = this.game.width;


  // this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  // this.spacebar.onDown.addOnce(this.startClick, this);

  var timer = this.game.time.create(false);
  timer.add(1000, this.setupSpacebar, this);
  timer.start();

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.setupSpacebar = function () {
  console.log("hit");
  this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.spacebar.onDown.addOnce(this.startClick, this);

}


Scoreboard.prototype.show = function(score) {
    var coin, bestScore, playerId;
    this.scoreText.setText(score.toString());

    if(!!localStorage) {
        bestScore = localStorage.getItem('bestScore');
        playerId = localStorage.getItem('playerId');

        if(!bestScore || bestScore < score) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        if(!playerId) {
            playerId = Math.floor(Math.random()*99999999);
            localStorage.setItem('playerId', playerId);
        }
        console.log(playerId);
    }
    else {
        bestScore = 'N/A';
    }

    this.bestText.setText(bestScore.toString());
    this.game.add.tween(this).to({x:0}, 1000, Phaser.Easing.Elastic.InOut, true);
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

Scoreboard.prototype.goToCharSel = function() {
  this.game.state.start('charSelect');
};





Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

module.exports = Scoreboard;
