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
var soundMuted = localStorage.getItem('soundMuted') || false;

function Play() {
}
Play.prototype = {
  create: function() {

    if (!localStorage.getItem('soundMuted')) {
        localStorage.setItem('soundMuted',false);
    }
    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    this.background = this.game.add.tileSprite(0,0, 288, 505, 'background');
    this.background.autoScroll(-2.5,-10);

    this.fog = new Fog(this.game, 0,this.game.backgroundPos.fog, 663, 146);
    this.fog2 = new Fog(this.game, 0,this.game.backgroundPos.fog2, 663, 146);
    this.fog3 = new Fog(this.game, 0,this.game.backgroundPos.fog3, 663, 146);
    this.game.add.existing(this.fog);

    this.mountains2 = new Mountains_2(this.game, 0, this.game.backgroundPos.mountains2, 663, 146);
    this.game.add.existing(this.mountains2);

    this.game.add.existing(this.fog2);

    this.mountains = new Mountains(this.game, 0, this.game.backgroundPos.mountains, 576, 130);
    this.game.add.existing(this.mountains);

    this.game.add.existing(this.fog3);

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
    this.ground = new Ground(this.game, 0, 400, 335, 112);
    this.game.add.existing(this.ground);


    this.human = new Human(this.game,(this.game.width / 4), 385);
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

    this.playerId = localStorage.getItem('playerId') || Math.floor(Math.random()*99999999);

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
    this.game.medalGeneratorRangeLow = 5;

    this.game.platformGeneratorRangeHigh = 8;
    this.game.platformGeneratorRangeLow = 4;


    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
    this.scoreSound = this.game.add.audio('score');
    this.ouchSound = this.game.add.audio('ouch');
    this.discoSound = this.game.add.audio('discoBall');

    this.game.soundMuted = soundMuted;
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
        // enable collisions between the human and each group in the pipes group
        //try{
        this.enemies.forEach(function(EnemyGroup) {
            this.game.physics.arcade.collide(this.human, EnemyGroup, this.deathHandler, null, this);
            this.game.physics.arcade.collide(EnemyGroup, this.ground, this.enemyWalking, null, this);

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


   // }catch(e){console.log(e);}

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

    soundMuted ?  this.soundButtonoState = 'soundOff': this.soundButtonoState = 'soundOn';

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

  walking: function(human, floor) {
      if(floor instanceof Ground && !this.human.onGround) {
          human.onGround = true;
          human.body.velocity.y=0;
      }
  },

  enemyWalking: function(floor, enemy) {
      if(enemy.alive)
      {
          if(!enemy.onGround)
          {
              enemy.onGround = true;
              enemy.body.velocity.y=0;
          }
          enemy.body.velocity.x= -200;
      }
      else{
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
        if(enemy instanceof SkyEnemy){
             new ScoreText(this.game ,human.position.x, human.position.y,"10");
            this.updateScore(10);
        }else{
             new ScoreText(this.game ,human.position.x, human.position.y,"5");
            this.updateScore(5);
        }
        if(!this.game.soundMuted){this.scoreSound.play();}
        return;
    }

    if((enemy instanceof SkyEnemy || enemy instanceof Enemy) && this.human.alive) {
        if(human.invincible){return enemy.kill();}
        this.scoreboard = new Scoreboard(this.game);
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

    platformGroup.reset(this.game.width+100, 300);
    platformGroup.generatePlatformType();

    console.log("generate platform in " + this.game.enemyGeneratorIntervals + " seconds");
  },

  generateEnemies: function() {
    var enemyGroup = this.enemies.getFirstExists(false);

    if(!enemyGroup) {
        enemyGroup = new EnemyGroup(this.game, this.enemies);
    }

    this.game.enemyGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.enemyGeneratorRangeLow,this.game.enemyGeneratorRangeHigh );

    this.enemyGenerator.delay = this.game.enemyGeneratorIntervals;

    console.log("generate enemy in " + this.game.enemyGeneratorIntervals + " seconds");
    enemyGroup.reset(this.game.width, 385);

  },
  generateMedals: function() {
    //this.enemy = new Enemy(this.game,  this.game.width + 40, 385);

    var medalY = this.game.rnd.integerInRange(50, 350);
    var medalGroup = this.medals.getFirstExists(false);

    if(!medalGroup) {
        medalGroup = new MedalGroup(this.game, this.medals);
    }

    this.game.medalGeneratorIntervals = Phaser.Timer.SECOND *this.game.rnd.integerInRange(this.game.medalGeneratorRangeLow,this.game.medalGeneratorRangeHigh );

    this.medalGenerator.delay = this.game.medalGeneratorIntervals;

    console.log("generate medal in "+this.game.medalGeneratorIntervals+" seconds");
    medalGroup.reset(this.game.width, medalY);

  },
  generateSkyEnemies: function() {
    //this.enemy = new Enemy(this.game,  this.game.width + 40, 385);

    var skyEnemyY = this.game.rnd.integerInRange(50, 300);
    var skyEnemyGroup = this.skyEnemies.getFirstExists(false);

    if(!skyEnemyGroup) {
        skyEnemyGroup = new SkyEnemyGroup(this.game, this.skyEnemies);
    }
    this.game.skyEnemyGeneratorIntervals = Phaser.Timer.SECOND * this.game.rnd.integerInRange(this.game.skyEnemyGeneratorRangeLow,this.game.skyEnemyGeneratorRangeHigh );
    console.log("generate sky enemy in "+this.game.skyEnemyGeneratorIntervals+" seconds");
    this.skyEnemyGenerator.delay = this.game.skyEnemyGeneratorIntervals;

    skyEnemyGroup.reset(this.game.width, skyEnemyY);


  },
  submitScore: function (score) {


      var message =  '035abec9c53bd47d' + this.playerId + score;
      var hash = CryptoJS.HmacSHA256(message, '5a2337d09435c49690d451403fd77aa23e540325749518a2227a44bcc472a530');
      var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

      $.ajax({
            method: 'PUT',
            url: 'http://api.leaderboards.io/leaderboard/035abec9c53bd47d',
            contentType: 'application/json',
            data: JSON.stringify({
              'playerId': this.playerId /*your apps player id. any unique identifier*/ ,
              'name': 'testy t',
              'score': 1000,
              'signature':  hash
            }),
            dataType: 'json'
          })
          .done(function(response) {
            console.log(response);
          })
          .fail(function(error) {
            console.log(error);
      });

  },
  increaseDifficulty: function (){
    console.log("increase difficulty");

      //  ranges for generation
    // this.game.enemyGeneratorRangeHigh = 6;
    // this.game.enemyGeneratorRangeLow = 4;

    // this.game.skyEnemyGeneratorRangeHigh = 7;
    // this.game.skyEnemyGeneratorRangeLow = 3;

    // this.game.medalGeneratorRangeHigh = 6;
    // this.game.medalGeneratorRangeLow = 5;

    // this.game.platformGeneratorRangeHigh = 8;
    // this.game.platformGeneratorRangeLow = 4;

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
