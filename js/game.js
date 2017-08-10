(function($) {

  let Game = {};

  Game.Init = function() {
    let self = this;

    this.startGame();
  };

  Game.Init.prototype = {

    startGame() {
      this.initPlayer();
      this.initComp();
      this.initBattle();
    },

    initPlayer() {
      this.player = new Game.Player();
    },

    initComp() {
      this.comp = new Game.Comp();
    },

    initBattle() {
      this.battle = new Game.Battle();
    }
  };
  
  window.Game = Game;

})(jQuery);
