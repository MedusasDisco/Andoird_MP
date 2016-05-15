'use strict';

var medal = require('./medal');

var MedalGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.medal = new medal(this.game, 0, 0, 0);
  this.add(this.medal);
  this.hasScored = false;

  this.setAll('body.velocity.x', -200);
};

MedalGroup.prototype = Object.create(Phaser.Group.prototype);
MedalGroup.prototype.constructor = MedalGroup;

MedalGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

MedalGroup.prototype.checkWorldBounds = function() {
  if(!this.medal.inWorld) {
    this.exists = false;
  }
};


MedalGroup.prototype.reset = function(x, y) {
  this.medal.reset(0,0);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.exists = true;
};


MedalGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = MedalGroup;