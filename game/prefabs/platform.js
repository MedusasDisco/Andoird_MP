'use strict';

var Platform = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'platform', frame);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enable(this);

  this.body.allowGravity = false;
  this.body.immovable = true;
  this.body.enable = true;
  this.body.checkCollision.left = false;
  this.body.checkCollision.right = false;
  this.body.checkCollision.down = false;
  this.body.setSize(181, 23);
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  // write your prefab's specific update code here
  
};

module.exports = Platform;