'use strict';

var scoreText = function(game, x, y, text) {
  this.name = 'scoreText';
  this.alive = false;
  this.onGround = false;
  this.game = game;

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
 
  this.scoreLabel = this.game.add.bitmapText(x-5, y-50, 'mainFont',text, 20);

  this.scoreLabel.tint = 0xf46f70;

  this.game.time.events.add(Phaser.Timer.SECOND * .6, this.onKilled, this);
  
  
};

//scoreText.prototype = Object.create(Phaser.Sprite.prototype);
scoreText.prototype.constructor = scoreText;

scoreText.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Medal towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // } 

  // if(!this.alive) {
  //   this.body.velocity.x = 0;
  // }
};

scoreText.prototype.revived = function() { 
};

scoreText.prototype.onKilled = function() {
  this.exists = false;
  this.visible = false;
  this.game.world.remove(this.scoreLabel);
};

module.exports = scoreText;

