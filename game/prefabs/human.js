'use strict';

var Human = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'characterSpriteSheet', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('tylerWalk', [6,7,8,7] );
  this.animations.add('tylerInstWalk', [24,25,26,25] );
  this.animations.add('hunterWalk', [0,1,2,1] );
  this.animations.add('hunterInstWalk', [21,22,23,22] );
  this.animations.add('alexWalk', [3,4,5,4] );
  this.animations.add('alexInstWalk', [15,16,17,16] );
  this.animations.add('wyntonWalk', [9,10,11,10] );
  this.animations.add('wyntonInstWalk', [18,19,20,19] );
  this.animations.add('robinWalk', [12,13,14,13] );
  this.animations.add('robinInstWalk', [27,28,29,28] );
  this.animations.play('wyntonWalk', 12, true);

  this.memberSelected="";

  this.jumpSound = this.game.add.audio('jump');

  this.name = 'Human';
  this.alive = false;
  this.onGround = false;
  this.jumpsLeft = this.game.jumpsLeft || 3;
  this.invincible = false;

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;
  this.body.enable = true;
  this.body.setSize(20, 32);
  this.body.friction = new Phaser.Point(0,0);
  this.events.onKilled.add(this.onKilled, this);

};


Human.prototype = Object.create(Phaser.Sprite.prototype);
Human.prototype.constructor = Human;


Human.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Human towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // }
  if(this.onGround && this.jumpsLeft < this.game.jumpsLeft){
    this.jumpsLeft = this.game.jumpsLeft || 3;
  }

  if(this.body.position.x != (this.game.width / 4)){
    this.body.position.x = this.game.width / 4;
  }
};

Human.prototype.superCharged = function(){
  //we toggle invincibility
  this.memberSelected = this.game.humanSpriteSheet;
  this.game.humanSpriteSheet = this.game.humanSpriteSheet+"Inst";
  this.tint = 0xffffff;
  this.game.time.events.add(Phaser.Timer.SECOND * 4, this.unCharged, this);
}


Human.prototype.unCharged = function(){

}

Human.prototype.jump = function() {
  if(!!this.alive && this.jumpsLeft > 0) {

    // play jump sound
    if(!this.game.soundMuted){this.jumpSound.play();}

    // if first jump, we aren't on ground anymore
    if(this.onGround){this.onGround = false;}

    //cause our Human to "jump" upward
    this.body.velocity.y = this.game.velocityY;

    // subtract a jump
    this.jumpsLeft --;

  }
};


Human.prototype.revived = function() {
};

Human.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.body.collideWorldBounds = false;
  this.animations.stop();
  var duration = 90 / this.y * 300;
  this.game.add.tween(this).to({angle: 90}, duration).start();
  // console.log('killed');
  // console.log('alive:', this.alive);
};

module.exports = Human;
