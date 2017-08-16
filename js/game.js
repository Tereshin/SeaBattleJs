let Game = {};

Game.Init = function() {
  let self = this;

  this.sizeX = 10;
  this.sizeY = 10;

  this.shipTypes = { 
    "ship-4": [4, 1],
    "ship-3": [3, 2],
    "ship-2": [2, 3],
    "ship-1": [1, 4]
  };

  this.startGame();
};

Game.Init.prototype = {

  startGame() {
    this.initPlayer();
    this.initComp();
    this.initBattle();
  },

  initPlayer() {
    this.player = new Game.Player(this.sizeX, this.sizeY, this.shipTypes);
  },

  initComp() {
    this.comp = new Game.Comp(this.sizeX, this.sizeY, this.shipTypes);
  },

  initBattle() {
    this.battle = new Game.Battle(this.sizeX, this.sizeY, this.shipTypes);
  }
};

window.Game = Game;