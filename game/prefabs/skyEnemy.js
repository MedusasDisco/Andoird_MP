'use strict';

var SkyEnemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'skyEnemy', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('brownSnake', [0,1,2,1] );
  this.animations.add('greenSnake', [3,4,5,4] );
  this.animations.add('purpleSnake', [6,7,8,7] );
  this.animations.add('blackSnake', [9,10,11,10] );
  this.animations.play('greenSnake', 12, true);


  this.flapSound = this.game.add.audio('flap');

  this.name = 'SkyEnemy';
  this.alive = false;
  this.onGround = true;

  this.flapTimer = game.time.events.loop(Phaser.Timer.SECOND * .50, this.flap, this);
  this.flapTimer.timer.start();
 

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  this.body.collideWorldBounds = false;
  this.body.enable = true;
  this.body.setSize(20, 15);

  this.events.onKilled.add(this.onKilled, this);
  this.body.velocity.y = -300;
  
};

SkyEnemy.prototype = Object.create(Phaser.Sprite.prototype);
SkyEnemy.prototype.constructor = SkyEnemy;

SkyEnemy.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the SkyEnemy towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // } 


  if(!this.alive) {
    //this.body.velocity.x = 0;
  }
};

SkyEnemy.prototype.flap = function() {


  if(!!this.alive) {

    //if(!this.body.allowGravity){this.body.allowGravity = true;}
    this.body.velocity.y = -300;
    // rotate the SkyEnemy to -40 degrees
    //this.game.add.tween(this).to({angle: 10}, 100).start();
  }

  

};

SkyEnemy.prototype.revived = function() { 
};

SkyEnemy.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.body.collideWorldBounds = false;
  console.log('killed');
  console.log('alive:', this.alive);
};

module.exports = SkyEnemy;

