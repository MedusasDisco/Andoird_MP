(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


var BootState = require('./states/boot');
var CharSelectState = require('./states/charSelect');
var LeaderBoardState = require('./states/leaderBoard');
var MenuState = require('./states/menu');
var PlayState = require('./states/play');
var PreloadState = require('./states/preload');

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'medusas-pixel');

// Game States
game.state.add('boot', BootState);
game.state.add('charSelect', CharSelectState);
game.state.add('leaderBoard', LeaderBoardState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('preload', PreloadState);


game.state.start('boot');

},{"./states/boot":21,"./states/charSelect":22,"./states/leaderBoard":23,"./states/menu":24,"./states/play":25,"./states/preload":26}],2:[function(require,module,exports){
/**
 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var HealthBar = function(game, providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 250,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#FEFF03'
        },
        animationDuration: 200,
        flipped: false,
        isFixedToCamera: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

HealthBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

HealthBar.prototype.drawHealthBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};


HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
};

module.exports = HealthBar;

},{}],3:[function(require,module,exports){
'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('walkLeft', [0,1,2,1] );
  this.animations.add('dead', [3] );
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

};

Enemy.prototype.jump = function() {
  if(!!this.alive&&this.game.enemyJumpBool) {

    //cause our Enemy to "jump" upward
    if(this.onGround){this.onGround = false;}

    //cause our Human to "jump" upward
    this.body.velocity.y = this.game.rnd.integerInRange(-400,-600);

    // rotate the Enemy to -40 degrees
    //this.game.add.tween(this).to({angle: -40}, 100).start();
  }
};


Enemy.prototype.revived = function() {

  this.animations.play('walkLeft', 12, true);
};

Enemy.prototype.onKilled = function() {
  this.body.velocity.y = 100;
  this.animations.play('dead', 1, true);
  this.exists = true;
  this.alive = false;
  this.visible = true;
  this.body.velocity.y = 100;
  this.game.time.events.add(Phaser.Timer.SECOND * 1, this.revived, this);
};

module.exports = Enemy;

},{}],4:[function(require,module,exports){
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
},{"./enemy":3}],5:[function(require,module,exports){
'use strict';

var Fog = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'fog');
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

Fog.prototype = Object.create(Phaser.TileSprite.prototype);
Fog.prototype.constructor = Fog;

Fog.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Fog;
},{}],6:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  // start scrolling our ground
  this.autoScroll(-200,0);
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);
      
  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.body.enable = true;


};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;
},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var Medal = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'discoBall', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap',[0,1,2,3,6,7]);
  this.animations.play('flap', 12, true);

  this.flapSound = this.game.add.audio('flap');

  this.name = 'Medal';
  this.alive = false;
  this.onGround = false;


  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = false;
  this.body.setSize(30,30);

  this.events.onKilled.add(this.onKilled, this);

};

Medal.prototype = Object.create(Phaser.Sprite.prototype);
Medal.prototype.constructor = Medal;

Medal.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Medal towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // }

  // if(!this.alive) {
  //   this.body.velocity.x = 0;
  // }
};

Medal.prototype.revived = function() {
};

Medal.prototype.onKilled = function() {
  this.exists = false;
  this.visible = false;
  this.animations.stop();
  // console.log('killed');
  // console.log('alive:', this.alive);
};

module.exports = Medal;

},{}],9:[function(require,module,exports){
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
},{"./medal":8}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
'use strict';

var Mountains_2 = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'mountains_2');
  // start scrolling our ground
  this.autoScroll(-4,0);
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);
      
  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.body.enable = true;


};

Mountains_2.prototype = Object.create(Phaser.TileSprite.prototype);
Mountains_2.prototype.constructor = Mountains_2;

Mountains_2.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Mountains_2;
},{}],12:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;
  
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  // write your prefab's specific update code here
  
};

module.exports = Pipe;
},{}],13:[function(require,module,exports){
'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.topPipe);
  this.add(this.bottomPipe);
  this.hasScored = false;

  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  this.checkWorldBounds(); 
};

PipeGroup.prototype.checkWorldBounds = function() {
  if(!this.topPipe.inWorld) {
    this.exists = false;
  }
};


PipeGroup.prototype.reset = function(x, y) {
  this.topPipe.reset(0,0);
  this.bottomPipe.reset(0,440);
  this.x = x;
  this.y = y;
  this.setAll('body.velocity.x', -200);
  this.hasScored = false;
  this.exists = true;
};


PipeGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
};

module.exports = PipeGroup;
},{"./pipe":12}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
  //console.log(rndNum);
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

},{"./platform":14}],16:[function(require,module,exports){
'use strict';

var scoreText = function(game, x, y, text) {
  this.name = 'scoreText';
  this.alive = false;
  this.onGround = false;
  this.game = game;

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started

  this.scoreLabel = this.game.add.bitmapText(x-5, y-50, 'mainFont',text, 20);

  this.scoreLabel.tint = this.game.scoreLabel;

  this.game.time.events.add(Phaser.Timer.SECOND * .6, this.onKilled, this);


};

//scoreText.prototype = Object.create(Phaser.Sprite.prototype);
scoreText.prototype.constructor = scoreText;

scoreText.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the Medal towards the ground by 2.5 degrees
  // if(this.angle < 90 && this.alive) {
  //   this.angle += 2.5;
  // }

  // if(!this.alive) {
  //   this.body.velocity.x = 0;
  // }
};

scoreText.prototype.revived = function() {
};

scoreText.prototype.onKilled = function() {
  this.exists = false;
  this.visible = false;
  this.game.world.remove(this.scoreLabel);
};

module.exports = scoreText;

},{}],17:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {

  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  // this.scoreboard = this.game.add.graphics(50,50);
  // this.scoreboard.lineStyle(2, 0xFFFFFF, 1);
  // this.scoreboard.beginFill(0x1f1544, 1);
  // this.scoreboard.drawRect(-30,this.game.height/100, this.game.width - 40, this.game.height/2);

  this.scoreText = this.game.add.bitmapText((this.game.width/2), 160, 'mainFont', '', 18);
  this.add(this.scoreText);

  this.bestText = this.game.add.bitmapText((this.game.width/2), 215, 'mainFont', '', 18);
  this.add(this.bestText);
  this.menuWidth = (this.game.width / 2) - 150;
  // add our start button with a callback
  // this.leaderBoardBG = this.game.add.graphics(50,50);
  // this.leaderBoardBG.lineStyle(2, 0xFFFFFF, 1);
  // this.leaderBoardBG.beginFill(0x1f1544, 1);
  // this.leaderBoardBG.drawRect( this.menuWidth, (this.game.height/100)+ 300, 250, 80);
  // this.add(this.leaderBoardBG);

  this.leaderBoardButton = this.game.add.button(this.game.width/2 - 5, 360, 'leaderboardBtn', this.gplayClick, this);
  this.leaderBoardButton.anchor.setTo(0.5,0.5);
  this.add(this.leaderBoardButton);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width/2 + 60, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  this.add(this.startButton);

  this.backButton = this.game.add.button((this.game.width/2)- 60, 300, 'back', this.goToCharSel, this);
  this.backButton.anchor.setTo(0.5,0.5);
  this.add(this.backButton);


  this.y = 0;//this.game.height;v
  this.x = this.game.width;


  // this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  // this.spacebar.onDown.addOnce(this.startClick, this);

  var timer = this.game.time.create(false);
  timer.add(1000, this.setupSpacebar, this);
  timer.start();

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.setupSpacebar = function () {
  this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.spacebar.onDown.addOnce(this.startClick, this);

}


Scoreboard.prototype.show = function(score) {
    this.score = score;
    var coin, bestScore, playerId;
    this.scoreText.setText(score.toString());

    if(!!localStorage) {
        bestScore = localStorage.getItem('bestScore');
        //playerId = localStorage.getItem('playerId');

        if(!bestScore || bestScore < score) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        if(!playerId) {
            //playerId = Math.floor(Math.random()*99999999);
            //localStorage.setItem('playerId', playerId);
        }
      //  console.log(playerId);
    }
    else {
        bestScore = 'N/A';
    }

    this.bestText.setText(bestScore.toString());
    this.game.add.tween(this).to({x:0}, 1000, Phaser.Easing.Elastic.InOut, true);
};

Scoreboard.prototype.gplayClick = function() {
    toggleGplayScreen(this.score);
    window.game.submitScore(leaderboardId, this.score);
  // window.game.showLeaderboard(leaderboardId);
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

Scoreboard.prototype.goToCharSel = function() {
  this.game.state.start('charSelect');
};

Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

module.exports = Scoreboard;

},{}],18:[function(require,module,exports){
'use strict';

var SkyEnemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'skyEnemy', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('brownSnake', [0,1,2,1] );
  this.animations.add('greenSnake', [3,4,5,4] );
  this.animations.add('purpleSnake', [6,7,8,7] );
  this.animations.add('blackSnake', [9,10,11,10] );
  this.animations.play('greenSnake', 12, true);

  this.snakeArray= [0,0,0]

  this.flapSound = this.game.add.audio('flap');

  this.name = 'SkyEnemy';
  this.alive = false;
  this.onGround = true;



  this.flapTimer = game.time.events.loop(Phaser.Timer.SECOND * .50, this.flap, this);
  this.flapTimer.timer.start();

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
  var snakeType = Math.floor(Math.random()*20);
  this.animations.play('greenSnake', 12, true);
};

SkyEnemy.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.body.collideWorldBounds = false;
  this.game.time.events.add(Phaser.Timer.SECOND * 1, this.revived, this);
};

module.exports = SkyEnemy;

},{}],19:[function(require,module,exports){
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
},{"./skyEnemy":18}],20:[function(require,module,exports){
'use strict';

var SnowHill = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'snowHill');
  // start scrolling our ground
  this.autoScroll(-6,0);
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);
      
  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.body.enable = true;


};

SnowHill.prototype = Object.create(Phaser.TileSprite.prototype);
SnowHill.prototype.constructor = SnowHill;

SnowHill.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = SnowHill;
},{}],21:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],22:[function(require,module,exports){

'use strict';
var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');
function CharSel() {}

CharSel.prototype = {
  preload: function() {

  },
  create: function() {

    this.background = this.game.add.tileSprite(0,0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-2.5,-5);
    this.background.menuWidth = (this.game.width / 2) - 180;

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, this.game.width, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, this.game.width, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, this.game.width, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, this.game.width, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, this.game.width, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,this.game.backgroundPos.ground, this.game.width,112,'ground');
    this.ground.autoScroll(-200,0);

    this.menuBG = this.game.add.graphics(50,50);
    this.menuBG.lineStyle(2, 0xFFFFFF, 1);
    this.menuBG.beginFill(0x1f1544, 1);
    this.menuBG.drawRect( this.background.menuWidth, this.game.height/100, 250, 250);


    this.charSelText = this.game.add.bitmapText( (this.game.width/2) - 105 ,70 , 'mainFont',"Select Your Character", 20);
    this.setUnlockedText();


    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

    this.game.humanSpriteSheet = "tyler";
    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(0,0,'characterSelectSheet');
    this.titleGroup.add(this.title);


    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = (this.game.width / 2) - 110;
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 2000, true);

    // add our start button with a callback
    this.hunterButton = this.game.add.button(this.game.width/2+10, 120, 'hunterBtn', this.hunterClick, this);
    this.hunterButton.anchor.setTo(0.5,0.5);


    this.alexButton = this.game.add.button(this.game.width/2+10, 155, 'alexBtn', this.alexClick, this);
    this.alexButton.anchor.setTo(0.5,0.5);


    this.tylerButton = this.game.add.button(this.game.width/2+10, 190, 'tylerBtn', this.tylerClick, this);
    this.tylerButton.anchor.setTo(0.5,0.5);


    this.wyntonButton = this.game.add.button(this.game.width/2+10, 225, 'wyntonBtn', this.wyntonClick, this);
    this.wyntonButton.anchor.setTo(0.5,0.5);


    this.robinButton = this.game.add.button(this.game.width/2+10, 260, 'robinBtn', this.robinClick, this);
    this.robinButton.anchor.setTo(0.5,0.5);


    this.musicBtnBG = this.game.add.graphics(50,50);
    this.musicBtnBG.lineStyle(2, 0xFFFFFF, 1);
    this.musicBtnBG.beginFill(0x1f1544, 1);
    this.musicBtnBG.drawRect( this.background.menuWidth, (this.game.height/100)+ 275, 250, 50);
    this.setMusicBtn();
    //
    // this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, 'musicOff', this.musicOff, this);
    // this.musicBtn.anchor.setTo(0.5,0.5);

    // this.musicOnBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 380, 'musicOn', this.musicOn, this);
    // this.musicOnBtn.anchor.setTo(0.5,0.5);


    // this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.charClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
  },
  hunterClick: function() {
    this.game.humanSpriteSheet = "hunter";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -400;
    this.game.scoreLabel = 0xf46f70;
    this.game.state.start('play');
  },
  alexClick: function() {
    this.game.humanSpriteSheet = "alexInst";
    this.game.jumpsLeft = 4;
    this.game.velocityY = -380;
    this.game.scoreLabel = 0xF4B06F;
    this.game.state.start('play');
  },
  tylerClick: function() {
    this.game.humanSpriteSheet = "tyler";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -440;
    this.game.scoreLabel = 0x6FF4F3;
    this.game.state.start('play');
  },
  wyntonClick: function() {
    this.game.humanSpriteSheet = "wynton";
    this.game.jumpsLeft = 2;
    this.game.velocityY = -550;
    this.game.scoreLabel = 0x6FF470;
    this.game.state.start('play');
  },
  robinClick: function() {
    this.game.humanSpriteSheet = "robin";
    this.game.jumpsLeft = 3;
    this.game.velocityY = -420;
    this.game.scoreLabel = 0x706FF4;
    this.game.state.start('play');
  },
  setUnlockedText: function(){
    if(!!localStorage) {
        this.bestScore = localStorage.getItem('bestScore') || 0;
    }
    if(this.bestScore > 500){
      this.unlockedText = this.game.add.bitmapText( (this.game.width/2) - 90 , 5 , 'mainFont',"Unlocked album at", 20);
      this.unlockedWebText = this.game.add.bitmapText( (this.game.width/2) - 105 , 25 , 'mainFont',"MedusasDisco.com/8bit", 20);
      this.unlockedText.tint = 0xf46f70;
      this.unlockedWebText.tint = 0xf46f70;
    }
  },
  setMusicBtn: function(){
    musicPlaying ?  this.musicButtonState = 'musicOn': this.musicButtonState = 'musicOff';

    this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, this.musicButtonState, this.toggleMusic, this);
    this.musicBtn.anchor.setTo(0.5,0.5);
  },
  toggleMusic: function(){

    this.musicBtn.destroy();

    musicPlaying = !musicPlaying;

    if (!musicPlaying){
        soundTrack.stop();
        this.musicButtonState = 'musicOff'
    } else {
        soundTrack.play({numberOfLoops: 100,playAudioWhenScreenIsLocked: false});
        this.musicButtonState = 'musicOn';
    }
    this.game.musicPlaying = musicPlaying;

    this.musicBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, this.musicButtonState, this.toggleMusic, this);
    this.musicBtn.anchor.setTo(0.5,0.5);
  }
};

module.exports = CharSel;

},{"../prefabs/fog":5,"../prefabs/mountains":10,"../prefabs/mountains_2":11,"../prefabs/snowHill":20}],23:[function(require,module,exports){

'use strict';
var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');
function LeaderBoard() {}

LeaderBoard.prototype = {
  preload: function() {

  },
  create: function() {

    this.background = this.game.add.tileSprite(0,0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-2.5,-5);
    this.background.menuWidth = (this.game.width / 2) - 180;

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, this.game.width, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, this.game.width, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, this.game.width, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, this.game.width, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, this.game.width, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,this.game.backgroundPos.ground, this.game.width,112,'ground');
    this.ground.autoScroll(-200,0);

    // this.menuBG = this.game.add.graphics(50,50);
    // this.menuBG.lineStyle(2, 0xFFFFFF, 1);
    // this.menuBG.beginFill(0x1f1544, 1);
    // this.menuBG.drawRect( this.background.menuWidth, this.game.height/100, 250, 250);


    this.charSelText = this.game.add.bitmapText( (this.game.width/2) - 105 ,70 , 'mainFont',"Select Your Character", 20);



    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(0,0,'characterSelectSheet');
    this.titleGroup.add(this.title);


    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = (this.game.width / 2) - 110;
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 2000, true);

    // add our start button with a callback

    this.gplayBG = this.game.add.graphics(50,50);
    this.gplayBG.lineStyle(2, 0xFFFFFF, 1);
    this.gplayBG.beginFill(0x1f1544, 1);
    this.gplayBG.drawRect( this.background.menuWidth, (this.game.height/100)+ 275, 250, 50);

    this.gplayBtn = this.game.add.button(this.game.width/2, (this.game.height/100)+ 350, 'gplayBtn', this.gplayClick, this);
    this.gplayBtn.anchor.setTo(0.5,0.5);



    // this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.charClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
  },
  gplayClick: function() {
    window.game.submitScore(leaderboardId, score);
    window.game.showLeaderboard(leaderboardId);
  }
};

module.exports = LeaderBoard;

},{"../prefabs/fog":5,"../prefabs/mountains":10,"../prefabs/mountains_2":11,"../prefabs/snowHill":20}],24:[function(require,module,exports){
'use strict';

var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');

var leaderboardId = "CgkIg62_ic4ZEAIQAg";
var achievementId1 = "CgkIg62_ic4ZEAIQAA";

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    // add the background sprite
    this.background = this.game.add.tileSprite(0,0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-2.5,-10);

    this.game.backgroundPos = {};
    this.game.backgroundPos.fog = this.game.height-230;
    this.game.backgroundPos.fog2 = this.game.height-200;
    this.game.backgroundPos.fog3 = this.game.height-180;
    this.game.backgroundPos.mountains2 = this.game.height-235;
    //this.game.backgroundPos.snowHill = this.game.height-220;
    this.game.backgroundPos.mountains = this.game.height-235;
    this.game.backgroundPos.ground = this.game.height-105;
    this.game.backgroundPos.groundSprites = this.game.height-120;

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, this.game.width, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, this.game.width, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, this.game.width, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, this.game.width, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, this.game.width, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,this.game.backgroundPos.ground, this.game.width,112,'ground');
    this.ground.autoScroll(-200,0);

    // this.menuBG = this.game.add.graphics(50,50);
    // this.menuBG.lineStyle(2, 0x1f1544, 1);
    // this.menuBG.beginFill(0xFFFFFF, 1);
    // this.menuBG.drawRect(-20,this.game.height/100, this.game.width - 40, this.game.height/1.5);


    /** STEP 1 **/
    // create a group to put the title assets in
    // so they can be manipulated as a whole
    this.titleGroup = this.game.add.group()

    /** STEP 2 **/
    // create the title sprite
    // and add it to the group
    this.title = this.add.sprite(0,0,'medusasTitle');
    // this.title.width = (this.title.width/3) ;
    // this.title.height = (this.title.height/3) ;
    this.titleGroup.add(this.title);

    /** STEP 3 **/
    // create the bird sprite
    // and add it to the title group
    //this.bird = this.add.sprite(200,5,'bird');
    //this.titleGroup.add(this.bird);

    /** STEP 4 **/
    // add an animation to the bird
    // and begin the animation
    //this.bird.animations.add('flap');
    //this.bird.animations.play('flap', 12, true);

    /** STEP 5 **/
    // Set the originating location of the group
    this.titleGroup.x = (this.game.width/2) - (this.title.width /2);
    this.titleGroup.y = 100;

    /** STEP 6 **/
    //  create an oscillating animation tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 2000, true);

    // add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, this.game.height - 50, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);
    //this.titleGroup.add(this.startButton);
  },
  startClick: function() {
    // start button click handler
    // start the 'play' state
    this.game.state.start('charSelect');
  }
};

module.exports = Menu;

},{"../prefabs/fog":5,"../prefabs/mountains":10,"../prefabs/mountains_2":11,"../prefabs/snowHill":20}],25:[function(require,module,exports){
'use strict';
//var Bird = require('../prefabs/bird');
var Human = require('../prefabs/human');
var Enemy = require('../prefabs/enemy');
var SkyEnemy = require('../prefabs/skyEnemy');
var Ground = require('../prefabs/ground');
var Medal = require('../prefabs/medal');
var Pipe = require('../prefabs/pipe');
var Platform = require('../prefabs/platform');
var PipeGroup = require('../prefabs/pipeGroup');
var EnemyGroup = require('../prefabs/enemyGroup')
var SkyEnemyGroup = require('../prefabs/skyEnemyGroup');
var MedalGroup = require('../prefabs/medalGroup');
var PlatformGroup = require('../prefabs/platformGroup');
var Scoreboard = require('../prefabs/scoreboard');
var Mountains = require('../prefabs/mountains');
var Mountains_2 = require('../prefabs/mountains_2');
//var SnowHill = require('../prefabs/snowHill');
var Fog = require('../prefabs/fog');
var HealthBar = require('../prefabs/HealthBar');
var ScoreText = require('../prefabs/scoreText');

function Play() {
}
Play.prototype = {
  create: function() {

    if (!localStorage.getItem('soundMuted')) {
        localStorage.setItem('soundMuted',false);
    }
    if (!localStorage.getItem('musicPlaying')) {
        localStorage.setItem('musicPlaying',true);
    }

    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    this.background = this.game.add.tileSprite(0,0,this.game.width,this.game.height, 'background');
    this.background.autoScroll(-2.5,-10);

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, this.game.width, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, this.game.width, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, this.game.width, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, this.game.width, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, this.game.width, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0,this.game.backgroundPos.ground, this.game.width,112,'ground');
    this.ground.autoScroll(-200,0);

    // this.snowHill = new SnowHill(this.game, 0, this.game.backgroundPos.snowHill, 663, 146);
    // this.game.add.existing(this.snowHill);

    //this.powerUpBar = this.game.add.graphics(0,50);

    // var barConfig = {x: 140, y: 70,width:200,height:30, bg:{color:'#FFFFFF'},bar:{color:'#f46f70'},animationDuration:1000};
    // this.powerUpBar = new HealthBar(this.game, barConfig);
    // this.powerUpBar.setPercent(0);
    // this.powerUpBar.charge = 0;

    // create group for skyEnemies
    this.skyEnemies = this.game.add.group();

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();

    // create group for Platforms
    this.platforms = this.game.add.group();

    // create group for Enemies
    this.enemies = this.game.add.group();

    // create group for Medals
    this.medals = this.game.add.group();


    // create and add a new Bird object
   // this.bird = new Bird(this.game, 100, this.game.height/2);
    //this.game.add.existing(this.bird);

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, this.game.backgroundPos.ground, this.game.width, 112);
    this.game.add.existing(this.ground);


    this.human = new Human(this.game,(this.game.width / 4), this.game.backgroundPos.groundSprites);
    this.game.add.existing(this.human);

    this.human.animations.play(this.game.humanSpriteSheet+"Walk", 12, true);


    // add keyboard controls
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.human.jump, this.human);


    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.human.jump, this.human);

    // keep the spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    this.score = 0;
    this.previousScore = 0;
    this.scoreLabel = this.game.add.bitmapText((this.game.width/2) - 40, 10, 'mainFont','Score: ', 20);
    this.scoreText = this.game.add.bitmapText(this.game.width/2+20, 10, 'mainFont',this.score.toString(), 20);
    this.scoreLabel.tint = this.game.scoreLabel;
    this.scoreText.tint = this.game.scoreLabel;
    // this.discoScore = 0;
    // this.discoLabel = this.game.add.bitmapText(20, 10, 'mainFont','Disco Balls:', 20);
    // this.discoText = this.game.add.bitmapText(140, 10, 'mainFont',this.discoScore.toString(), 20);

    //this.chargeText = this.game.add.bitmapText((this.game.width/2)-40,58 , 'mainFont',"charge", 24);


    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 70,'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 225,'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    // this.instructionBG = this.game.add.graphics(50,50);
    // this.instructionBG.lineStyle(2, 0xFFFFFF, 1);
    // this.instructionBG.beginFill(0x1f1544, 1);
    // this.instructionBG.drawRect(-30,this.game.height/100, this.game.width - 40, this.game.height/2);

    this.enemyGenerator = null;
    this.skyEnemyGenerator = null;
    this.medalGenerator = null;
    this.platformGenerator = null;

    //  ranges for generation
    this.game.enemyGeneratorRangeHigh = 6;
    this.game.enemyGeneratorRangeLow = 4;

    this.game.skyEnemyGeneratorRangeHigh = 7;
    this.game.skyEnemyGeneratorRangeLow = 3;

    this.game.medalGeneratorRangeHigh = 6;
    this.game.medalGeneratorRangeLow = 4;

    this.game.platformGeneratorRangeHigh = 8;
    this.game.platformGeneratorRangeLow = 4;


    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
    this.scoreSound = this.game.add.audio('score');
    this.ouchSound = this.game.add.audio('ouch');
    this.discoSound = this.game.add.audio('discoBall');

    this.game.soundMuted = soundMuted;
    this.game.musicPlaying = musicPlaying;
    this.setAudioBtn();

    this.gameover = false;

  },
  update: function() {
    // enemy walks on ground

    //this.game.physics.arcade.collide(this.enemy, this.ground, this.enemyWalking, null, this);

    // enable collisions between the human and the ground
    if(this.human.alive)
        {
            this.game.physics.arcade.collide(this.human, this.ground, this.walking, null, this);
            this.game.physics.arcade.collide(this.human, this.platform, this.walking, null, this);
        }

    if(!this.gameover) {
        this.enemies.forEach(function(EnemyGroup) {
            this.game.physics.arcade.collide(this.human, EnemyGroup, this.deathHandler, null, this);
            if (EnemyGroup.groundEnemy.alive) {
                  this.game.physics.arcade.collide(EnemyGroup, this.ground, this.enemyWalking, null, this);
            }
        }, this);

        this.platforms.forEach(function(PlatformGroup) {
            this.game.physics.arcade.collide(this.human, PlatformGroup, this.platformHandler, null, this);
            //this.game.physics.arcade.collide(MedalGroup, this.ground, this.enemyWalking, null, this);

        }, this);

        this.medals.forEach(function(MedalGroup) {
            this.game.physics.arcade.collide(this.human, MedalGroup, this.medalHandler, null, this);
            //this.game.physics.arcade.collide(MedalGroup, this.ground, this.enemyWalking, null, this);

        }, this);

        this.skyEnemies.forEach(function(skyEnemyGroup) {
            this.game.physics.arcade.collide(this.human, skyEnemyGroup, this.deathHandler, null, this);
            //this.game.physics.arcade.collide(skyEnemyGroup, this.ground, this.enemyWalking, null, this);

        }, this);

    }

  },
  shutdown: function() {

    //this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.human.destroy();
    this.pipes.destroy();
    this.enemies.destroy();
    this.skyEnemies.destroy();
    this.platforms.destroy();
    this.scoreboard.destroy();
  },
  startGame: function() {
    if(!this.human.alive && !this.gameover) {

        this.human.body.allowGravity = true;
        this.human.alive = true;

        // set the random time for each spawn based on range set in global variables
        this.game.enemyGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.enemyGeneratorRangeLow,this.game.enemyGeneratorRangeHigh );

        this.game.skyEnemyGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.skyEnemyGeneratorRangeLow,this.game.skyEnemyGeneratorRangeHigh );

        this.game.medalGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.medalGeneratorRangeLow,this.game.medalGeneratorRangeHigh );

        this.game.platformGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.platformGeneratorRangeLow,this.game.platformGeneratorRangeHigh );

        // add a timer
        this.enemyGenerator = this.game.time.events.loop(this.game.enemyGeneratorIntervals, this.generateEnemies, this);
        this.skyEnemyGenerator = this.game.time.events.loop(this.game.skyEnemyGeneratorIntervals, this.generateSkyEnemies, this);
        this.medalGenerator = this.game.time.events.loop(this.game.medalGeneratorIntervals, this.generateMedals, this);
        this.platformGenerator = this.game.time.events.loop(this.game.platformGeneratorIntervals, this.generatePlatforms, this);


        // Set time for SkyEnemies to start flapping
        // this.game.time.events.add(Phaser.Timer.SECOND * 30, this.flapSkyEnemies, this);

        // Set time for Enemies to start jumping
        this.game.time.events.add(Phaser.Timer.SECOND * 45, this.jumpEnemies, this);
        //this.game.time.events.add(Phaser.Timer.SECOND * 10, this.purpleSnakes, this);
        //this.game.time.events.add(Phaser.Timer.SECOND * 15, this.blackSnakes, this);

        this.enemyGenerator.timer.start();
        this.skyEnemyGenerator.timer.start();
        this.medalGenerator.timer.start();
        this.platformGenerator.timer.start();
        this.instructionGroup.destroy();

        this.game.time.events.loop(Phaser.Timer.SECOND * 10, this.increaseDifficulty, this);
        this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.timerHandler, this);

    }
  },
  goToCharSel: function(){
    this.game.state.start('charSel');
  },
  setAudioBtn: function(){
    soundMuted ?  this.soundButtonoState = 'soundOff': this.soundButtonoState = 'soundOn';

    this.soundButton = this.game.add.button(this.game.width/2, this.game.height - 50, this.soundButtonoState, this.toggleAudio, this);
    this.soundButton.anchor.setTo(0.5,0.5);
    this.soundButton.width = 25;
    this.soundButton.height = 25;

  },
  toggleAudio: function(){

    this.soundButton.destroy();

    soundMuted = !soundMuted;

    if (soundMuted){
        //this.game.soundTrack.stop();
        this.soundButtonoState = 'soundOff'
    } else {
        //this.game.soundTrack.play();
        this.soundButtonoState = 'soundOn';
    }
    this.game.soundMuted = soundMuted;

    this.soundButton = this.game.add.button(this.game.width/2, this.game.height - 50, this.soundButtonoState, this.toggleAudio, this);
    this.soundButton.anchor.setTo(0.5,0.5);
    this.soundButton.width = 25;
    this.soundButton.height = 25;
  },

  flapSkyEnemies: function(){
    this.game.flapBool = true;
  },

  jumpEnemies: function(){
    this.game.enemyJumpBool = true;
  },
  purpleSnakes: function(){
    this.game.snakes.purple = true;
  },
  blackSnakes: function(){
    this.game.snakes.black = true;
  },

  walking: function(human, floor) {
      if(floor instanceof Ground && !this.human.onGround) {
          human.onGround = true;
          human.body.velocity.y=0;
      }
  },

  enemyWalking: function(floor, enemy) {
      if(enemy.alive) {
          if(!enemy.onGround) {
              enemy.onGround = true;
              enemy.body.velocity.y=0;
          }
          enemy.body.velocity.x= -200;
      }
      else {
        //  console.log('dead');
          enemy.body.collideWorldBounds = false;
          enemy.body.velocity.y= 100;
      }
  },

  platformHandler: function(human, platform) {

    if(human.body.touching.down && !human.body.touching.right){
        human.onGround = true;
        human.body.velocity.y=0;
    }

  },
  updateScore: function(num){

      if(num >=60 || (this.score - this.previousScore) > 60) {
         this.score = this.previousScore;
         return;
      }
      this.score += num;
      this.scoreText.setText(this.score.toString());
      this.previousScore = this.score;
  },
  timerHandler: function(){
      this.updateScore(1);
  },

  medalHandler: function(human, medal) {
      new ScoreText(this.game ,human.position.x, human.position.y,"25");
      this.updateScore(25);

      if(!this.game.soundMuted){this.discoSound.play();}
      medal.kill();
  },

  deathHandler: function(human, enemy) {
    //console.log(human.body.touching.down+","+enemy.body.touching.up);
    if(human.body.touching.down && enemy.body.touching.up ){

        human.body.velocity.y = - 200;
        enemy.kill();
        if(enemy instanceof SkyEnemy){
            new ScoreText(this.game ,human.position.x, human.position.y,"10");
            human.jumpsLeft = human.jumpsLeft+1;
            this.updateScore(10);
        }else{
            new ScoreText(this.game ,human.position.x, human.position.y,"5");
            human.jumpsLeft = human.jumpsLeft;
            this.updateScore(5);
        }
        if(!this.game.soundMuted){this.scoreSound.play();}
        return;
    }

    if((enemy instanceof SkyEnemy || enemy instanceof Enemy) && this.human.alive) {
        if(human.invincible){return enemy.kill();}
        this.scoreboard = new Scoreboard(this.game);
        //this.submitScore(this.score);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.human.onGround = true;
        if(!this.game.soundMuted){this.groundHitSound.play();}
    }

    if(!this.gameover) {

        this.gameover = true;
        this.human.kill();
        this.pipes.callAll('stop');
        this.platforms.callAll('stop');
        this.medals.callAll('stop');
        this.enemyGenerator.timer.stop();
        this.skyEnemyGenerator.timer.stop();
        this.platformGenerator.timer.stop();
        this.ground.stopScroll();
        this.background.stopScroll();
        this.mountains.stopScroll();
        this.mountains2.stopScroll();
        //this.snowHill.stopScroll();

        this.game.flapBool = true;
        this.game.enemyJumpBool = false;

        // reset ranges for generation
        this.game.enemyGeneratorRangeHigh = 6;
        this.game.enemyGeneratorRangeLow = 4;

        this.game.skyEnemyGeneratorRangeHigh = 7;
        this.game.skyEnemyGeneratorRangeLow = 3;

        this.game.medalGeneratorRangeHigh = 6;
        this.game.medalGeneratorRangeLow = 5;

        this.game.platformGeneratorRangeHigh = 8;
        this.game.platformGeneratorRangeLow = 4;

    }

  },

  generatePlatforms: function() {
    var platformGroup = this.platforms.getFirstExists(false);

    if(!platformGroup) {
        platformGroup = new PlatformGroup(this.game, this.platforms);
    }

    this.game.platformGeneratorIntervals = Phaser.Timer.SECOND * this.game.rnd.integerInRange(this.game.platformGeneratorRangeLow,this.game.platformGeneratorRangeHigh );

    this.platformGenerator.delay = this.game.platformGeneratorIntervals;

    platformGroup.reset(this.game.width+100, this.game.backgroundPos.groundSprites - 55);
    platformGroup.generatePlatformType();

    //console.log("generate platform in " + this.game.enemyGeneratorIntervals + " seconds");
  },

  generateEnemies: function() {
    var enemyGroup = this.enemies.getFirstExists(false);

    if(!enemyGroup) {
        enemyGroup = new EnemyGroup(this.game, this.enemies);
    }

    this.game.enemyGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.enemyGeneratorRangeLow,this.game.enemyGeneratorRangeHigh );

    this.enemyGenerator.delay = this.game.enemyGeneratorIntervals;

    //console.log("generate enemy in " + this.game.enemyGeneratorIntervals + " seconds");
    enemyGroup.reset(this.game.width, this.game.backgroundPos.groundSprites);

  },
  generateMedals: function() {
    //this.enemy = new Enemy(this.game,  this.game.width + 40, 385);

    var medalY = this.game.rnd.integerInRange(this.game.backgroundPos.groundSprites- 300, this.game.backgroundPos.groundSprites-10);
    var medalGroup = this.medals.getFirstExists(false);

    if(!medalGroup) {
        medalGroup = new MedalGroup(this.game, this.medals);
    }

    this.game.medalGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.medalGeneratorRangeLow,this.game.medalGeneratorRangeHigh );

    this.medalGenerator.delay = this.game.medalGeneratorIntervals;

    //console.log("generate medal in "+this.game.medalGeneratorIntervals+" seconds");
    medalGroup.reset(this.game.width, medalY);

  },
  generateSkyEnemies: function() {
    //this.enemy = new Enemy(this.game,  this.game.width + 40, 385);

    var skyEnemyY = this.game.rnd.integerInRange(this.game.height - this.game.backgroundPos.groundSprites, this.game.backgroundPos.groundSprites - 50);
    var skyEnemyGroup = this.skyEnemies.getFirstExists(false);

    if(!skyEnemyGroup) {
        skyEnemyGroup = new SkyEnemyGroup(this.game, this.skyEnemies);
    }
    this.game.skyEnemyGeneratorIntervals = Phaser.Timer.SECOND * this.game.rnd.integerInRange(this.game.skyEnemyGeneratorRangeLow,this.game.skyEnemyGeneratorRangeHigh );
    // console.log("generate sky enemy in "+this.game.skyEnemyGeneratorIntervals+" seconds");
    this.skyEnemyGenerator.delay = this.game.skyEnemyGeneratorIntervals;

    skyEnemyGroup.reset(this.game.width, skyEnemyY);


  },
  increaseDifficulty: function (){

    if(this.game.enemyGeneratorRangeLow>1){
        this.game.enemyGeneratorRangeHigh -= .5;
        this.game.enemyGeneratorRangeLow -= .5;
    }

    if(this.game.skyEnemyGeneratorRangeLow>1){
        this.game.skyEnemyGeneratorRangeHigh -= .8;
        this.game.skyEnemyGeneratorRangeLow -= .5;
    }

    if(this.game.medalGeneratorRangeHigh<=10){
        this.game.medalGeneratorRangeHigh += 1;
        this.game.medalGeneratorRangeLow += .5;
    }

    if(this.game.platformGeneratorRangeLow>1){
        this.game.platformGeneratorRangeHigh -= .5;
        this.game.platformGeneratorRangeLow -= .5;
    }
  }
};

module.exports = Play;

},{"../prefabs/HealthBar":2,"../prefabs/enemy":3,"../prefabs/enemyGroup":4,"../prefabs/fog":5,"../prefabs/ground":6,"../prefabs/human":7,"../prefabs/medal":8,"../prefabs/medalGroup":9,"../prefabs/mountains":10,"../prefabs/mountains_2":11,"../prefabs/pipe":12,"../prefabs/pipeGroup":13,"../prefabs/platform":14,"../prefabs/platformGroup":15,"../prefabs/scoreText":16,"../prefabs/scoreboard":17,"../prefabs/skyEnemy":18,"../prefabs/skyEnemyGroup":19}],26:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.game.load.script('plasma', 'assets/filters/Plasma.js');

    this.game.snakes = {};

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('background', 'assets/background/spaceBG_2.png');
    this.load.image('mountains', 'assets/background/Mountains_v5.png');
    this.load.image('mountains_2', 'assets/background/mountains_2.png');
    this.load.image('snowHill', 'assets/background/snowHills2.png');
    this.load.image('fog', 'assets/background/fog_v2.png');
    this.load.image('ground', 'assets/Ground_01.png');
    this.load.spritesheet('platform', 'assets/platform_ice_1.png', 181,23,1);
    this.load.image('soundOff', 'assets/sound/sound_mute.png');
    this.load.image('soundOn', 'assets/sound/sound_high.png');
    this.load.spritesheet('soundSprite', 'assets/sound/soundSprite.png');

    // menu.js assets\
    this.load.image('medusasTitle', 'assets/menuImages/Title_small.png');
    this.load.image('startButton', 'assets/menuImages/start-button_v2.png');

    // charSelect.js assets
    this.load.image('instructions', 'assets/menuImages/instructions_v2.png');
    this.load.image('getReady', 'assets/menuImages/get-ready_2.png');
    this.load.image('musicOn', 'assets/menuImages/musicOnBtn.png');
    this.load.image('musicOff', 'assets/menuImages/musicOffBtn.png');
    this.load.spritesheet('musicToggle', 'assets/menuImages/musicBtnSprite.png',19, 120, 2);
    this.load.image('back', 'assets/menuImages/back_v2.png');

    this.load.image('scoreboard', 'assets/menuImages/scoreboard_v3.png');
    this.load.spritesheet('discoBall', 'assets/chars/discoBall_v3.png',30, 30, 8);
    this.load.image('gameover', 'assets/menuImages/gameover_2.png');


    // CharSelect assets
    this.load.image('gplayBtn', 'assets/menuImages/gplayBtn.png');
    this.load.image('gplayBtnLogout', 'assets/menuImages/gplayBtnLogout.png');
    this.load.image('leaderboardBtn', 'assets/leaderboardBtn.jpg');
    this.load.image('robinBtn', 'assets/chars/charButton_RobinBtn.png');
    this.load.image('wyntonBtn', 'assets/chars/charButton_WyntonBtn.png');
    this.load.image('hunterBtn', 'assets/chars/charButton_HunterBtn.png');
    this.load.image('tylerBtn', 'assets/chars/charButton_TylerBtn.png');
    this.load.image('alexBtn', 'assets/chars/charButton_AlexBtn.png');
    this.load.image('characterSelectSheet', 'assets/chars/characterSelectSheet.png');
    this.load.spritesheet('characterSpriteSheet', 'assets/chars/characterSpriteSheetFinal.png', 32,32,30);


    this.load.spritesheet('enemy', 'assets/chars/medusa_2.png', 32,32,6);
    //this.load.spritesheet('skyEnemy', 'assets/enemySky.png', 34,24,3);
    this.load.spritesheet('skyEnemy', 'assets/chars/snakes.png', 31+1/3,20,12);


    // Sound files
    this.load.audio('jump', 'assets/sound/flap.wav');
    this.load.audio('pipeHit', 'assets/sound/pipe-hit.wav');
    this.load.audio('groundHit', 'assets/sound/ground-hit.wav');
    this.load.audio('score', 'assets/sound/score.wav');
    this.load.audio('ouch', 'assets/sound/ouch.wav');
    this.load.audio('discoBall', 'assets/sound/discoBall.wav');

    this.load.bitmapFont('mainFont', 'assets/fonts/gem/gem.png', 'assets/fonts/gem/gem.xml');
    this.load.bitmapFont('nokiaFont', 'assets/fonts/nokia/nokia16.png', 'assets/fonts/nokia/nokia16.xml');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])