'use strict';

var Medal = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'discoBall', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap',[0,1,2,3,6,7]);
  this.animations.play('flap', 12, true);

  this.flapSound = this.game.add.audio('flap');

  this.name = 'Medal';
  this.alive = false;
  this.onGround = false;


  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = false;
  this.body.setSize(30,30);

  this.events.onKilled.add(this.onKilled, this);

};

Medal.prototype = Object.create(Phaser.Sprite.prototype);
Medal.prototype.constructor = Medal;

Medal.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Medal towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // }

  // if(!this.alive) {
  //   this.body.velocity.x = 0;
  // }
};

Medal.prototype.revived = function() {
};

Medal.prototype.onKilled = function() {
  this.exists = false;
  this.visible = false;
  this.animations.stop();
  // console.log('killed');
  // console.log('alive:', this.alive);
};

module.exports = Medal;
