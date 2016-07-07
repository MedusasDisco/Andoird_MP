'use strict';


<% _.forEach(gameStates, function(gameState) { %>var <%= gameState.stateName %> = require('./states/<%= gameState.shortName %>');
<% }); %>
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '<%= _.slugify(projectName) %>');

// Game States
<% _.forEach(gameStates, function(gameState) {  %>game.state.add('<%= gameState.shortName %>', <%= gameState.stateName %>);
<% }); %>

game.state.start('boot');
