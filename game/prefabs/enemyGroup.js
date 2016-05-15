'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.groundEnemy = new Enemy(this.game, 0, 0, 0);
  this.add(this.groundEnemy);
  this.hasScored = false;

  this.setAll('body.velocity.x', -200);
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

EnemyGroup.prototype.checkWorldBounds = function() {
  if(!this.groundEnemy.inWorld) {
    this.exists = false;
  }
};


EnemyGroup.prototype.reset = function(x, y) {
  this.groundEnemy.reset(0,0);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.exists = true;
};


EnemyGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = EnemyGroup;