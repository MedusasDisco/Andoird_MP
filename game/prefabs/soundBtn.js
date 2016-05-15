'use strict';

var soundBtn = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'discoBall', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('on',[0]);
  this.animations.add('off',[1]);
  this.animations.play('on', 1, true);


  this.name = 'soundBtn';
  this.alive = false;
  this.onGround = false;


  this.events.onInputDown.add(this.toggle, this);
  
};

soundBtn.prototype = Object.create(Phaser.Sprite.prototype);
soundBtn.prototype.constructor = soundBtn;

soundBtn.prototype.toggle = function() { 
  console.log("hit");
  if (game.soundMuted){
    this.animations.play('on', 1, true);
  }
  else {
  this.animations.play('off', 1, true);}
  
  game.soundMuted = !game.soundMuted;
};

module.exports = soundBtn;

