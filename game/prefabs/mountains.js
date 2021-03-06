'use strict';

var Mountains = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'mountains');
  // start scrolling our ground
  this.autoScroll(-8,0);
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);
      
  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.body.enable = true;


};

Mountains.prototype = Object.create(Phaser.TileSprite.prototype);
Mountains.prototype.constructor = Mountains;

Mountains.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Mountains;