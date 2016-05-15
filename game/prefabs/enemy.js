'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('walkLeft', [0,1,2,1] );
  this.animations.play('walkLeft', 12, true);


  this.flapSound = this.game.add.audio('flap');
  this.game.enemyJumpBool = false;
  this.name = 'Enemy';
  this.alive = true;
  this.onGround = true;

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  //this.body.collideWorldBounds = false;
  this.body.enable = true;
  this.body.setSize(20, 32);

  this.events.onKilled.add(this.onKilled, this);

  this.jumpTimer = game.time.events.loop(Phaser.Timer.SECOND * 1.50, this.jump, this);
  this.jumpTimer.timer.start();
 
  
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Enemy towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // } 

  if(!this.alive) {
    this.body.velocity.y = 100;
  }
};

Enemy.prototype.jump = function() {
  if(!!this.alive&&this.game.enemyJumpBool) {

    //cause our Enemy to "jump" upward
    if(this.onGround){this.onGround = false;}

    //cause our Human to "jump" upward
    console.log("jump");
    this.body.velocity.y = this.game.rnd.integerInRange(-400,-600);

    // rotate the Enemy to -40 degrees
    //this.game.add.tween(this).to({angle: -40}, 100).start();
  }
};


Enemy.prototype.revived = function() { 
};

Enemy.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.body.collideWorldBounds = false;
  console.log('killed');
  console.log('alive:', this.alive);
};

module.exports = Enemy;

