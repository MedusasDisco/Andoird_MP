'use strict';

var skyEnemy = require('./skyEnemy');

var SkyEnemyGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.groundEnemy = new skyEnemy(this.game, 0, 0, 0);
  this.add(this.groundEnemy);
  this.hasScored = false;

  this.setAll('body.velocity.x', -200);
};

SkyEnemyGroup.prototype = Object.create(Phaser.Group.prototype);
SkyEnemyGroup.prototype.constructor = SkyEnemyGroup;

SkyEnemyGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

SkyEnemyGroup.prototype.checkWorldBounds = function() {
  if(!this.groundEnemy.inWorld) {
    this.exists = false;
  }
};


SkyEnemyGroup.prototype.reset = function(x, y) {
  this.groundEnemy.reset(0,0);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.exists = true;
};


SkyEnemyGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = SkyEnemyGroup;