'use strict';

var Platform = require('./platform');

var PlatformGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPlatform = new Platform(this.game, 0, 0, 0);
  this.bottomPlatform = new Platform(this.game, 100, -100, 1);
  this.add(this.topPlatform);
  this.add(this.bottomPlatform);

  this.setAll('body.velocity.x', -200);
};

PlatformGroup.prototype = Object.create(Phaser.Group.prototype);
PlatformGroup.prototype.constructor = PlatformGroup;

PlatformGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

PlatformGroup.prototype.generatePlatformType = function() {
  
  var rndNum = Math.floor(Math.random()*10);
  console.log(rndNum);
  if(rndNum<=3){
    this.bottomPlatform.kill(0)
  }

};

PlatformGroup.prototype.checkWorldBounds = function() {
  if(!this.topPlatform.inWorld&&!this.bottomPlatform.inWorld&&this.bottomPlatform.position.x<-200) {
    this.exists = false;
  }
};


PlatformGroup.prototype.reset = function(x, y) {
  // var rndNum = Math.floor(Math.random()*10);
  // if(rndNum<5){this.remove(this.topPlatform)}
  // else{this.add(this.topPlatform)}
  this.topPlatform.reset(0,0);
  this.bottomPlatform.reset(100,-100);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.hasScored = false;
  this.exists = true;
};


PlatformGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = PlatformGroup;
