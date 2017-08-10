(function($) {

  Game.Battle = function() {

    this.sizeX = 10;
    this.sizeY = 10;

    this.player = $('._player .seabattle-arena tbody');
    this.comp = $('._comp .seabattle-arena tbody');

    this.statusArea = $('#seabattle-status');

    this.isDamaged = false;

    this.shipTypes = { 
      "ship-4": [4, 1],
      "ship-3": [3, 2],
      "ship-2": [2, 3],
      "ship-1": [1, 4]
    };

    this.shipsDamaged = [];
    this.shipsFutureShots = [];

    this.score = new Game.Score(this.shipTypes);

    this.init();
    
  };

  Game.Battle.prototype = {

    init() {
      let self = this;

      this.playerShot(self);
      

      this.score.reset();
      this.statusArea
        .removeClass("status-lose status-win")
        .addClass("status-playing")
        .html("Идет игра");
    },

    playerShot(self) {
      $('._comp .seabattle-arena tbody').click(function(event) {
        let position = event.target;
        self.onShot(position);
        return false;
      });
    },

    compNextShot() {
      let futureShots = this.shipsFutureShots.slice();
      let futureShotsIndex = Math.floor( Math.random() * futureShots.length );
      let coordinates = futureShots[futureShotsIndex];
      let prevShot = futureShots.slice().splice(futureShotsIndex, 1)[0];
      this.shipsFutureShots = futureShots.slice().filter((item) => {
        return !((item[0] === prevShot[0]) && (item[1] === prevShot[1]))
      });
      console.log("Возможные выстрелы без предыдущего выстрела: ", this.shipsFutureShots);
      let posX = coordinates[0];
      let posY = coordinates[1];
      let position = $('._player .seabattle-arena').find(`[x="${posX}"][y="${posY}"]`);
      return position;
    },

    compShot() {
      let position,
          posX,
          posY;

      if (this.shipsDamaged.length) {
        this.shipsDamaged = [];
      }

      if ($('._player .seabattle-arena .damaged').get().length) {
        $('._player .seabattle-arena .damaged').get().forEach((item) => {
          posX = $(item).attr('x');
          posY = $(item).attr('y');
          this.shipsDamaged.push([+posX, +posY]);
        })
        if (this.shipsDamaged.length === 1) {
          let futureShots = this.shipsFutureShots.slice();
          if (futureShots.length) {
            position = this.compNextShot();
          } else {
            if ((this.shipsDamaged[0][0] - 1) >= 0) {
              futureShots.push([this.shipsDamaged[0][0] - 1, this.shipsDamaged[0][1]]);
            }
            if ((this.shipsDamaged[0][0] + 1) <= 9) {
              futureShots.push([this.shipsDamaged[0][0] + 1, this.shipsDamaged[0][1]]);
            }
            if ((this.shipsDamaged[0][1] - 1) >=0 ) {
              futureShots.push([this.shipsDamaged[0][0], this.shipsDamaged[0][1] - 1]);  
            }
            if ((this.shipsDamaged[0][1] + 1) <= 9) {
              futureShots.push([this.shipsDamaged[0][0], this.shipsDamaged[0][1] + 1]);
            }
            this.shipsFutureShots = futureShots.slice().filter((item) => {
              let position = $('._player .seabattle-arena').find(`[x="${item[0]}"][y="${item[1]}"]`);
              return !$(position).is('.miss');
            });
            position = this.compNextShot();
          }
        } else {
          let futureShots = this.shipsFutureShots.slice();
          if (this.isDamaged) {
            futureShots = [];
          }
          if (this.shipsDamaged[1][0] === this.shipsDamaged[0][0]) {
            if (futureShots.length) {
              position = this.compNextShot();
            } else {
              if ((this.shipsDamaged[0][1] - 1) >= 0) {
                futureShots.push([this.shipsDamaged[0][0], this.shipsDamaged[0][1] - 1]);
              }
              if ((this.shipsDamaged[this.shipsDamaged.length - 1][1] + 1) <= 9) {
                futureShots.push([this.shipsDamaged[0][0], this.shipsDamaged[this.shipsDamaged.length - 1][1] + 1]);
              }
              this.shipsFutureShots = futureShots.slice().filter((item) => {
                let position = $('._player .seabattle-arena').find(`[x="${item[0]}"][y="${item[1]}"]`);
                return !$(position).is('.miss');
              });
              position = this.compNextShot();
            }
          } else if (this.shipsDamaged[1][1] === this.shipsDamaged[0][1]) {
            if (futureShots.length) {
              position = this.compNextShot();
            } else {
              if ((this.shipsDamaged[0][0] - 1) >= 0) {
                futureShots.push([this.shipsDamaged[0][0] - 1, this.shipsDamaged[0][1]]);
              }
              if (([this.shipsDamaged.length - 1][0] + 1) <= 9) {
                futureShots.push([this.shipsDamaged[this.shipsDamaged.length - 1][0] + 1, this.shipsDamaged[0][1]]);
              }
              this.shipsFutureShots = futureShots.slice().filter((item) => {
                let position = $('._player .seabattle-arena').find(`[x="${item[0]}"][y="${item[1]}"]`);
                return !$(position).is('.miss');
              });
              position = this.compNextShot();
            }
          }
        }
      } else {
          let posX = Math.floor( Math.random() * this.sizeX );
          let posY = Math.floor( Math.random() * this.sizeY );
          position = $('._player .seabattle-arena').find(`[x="${posX}"][y="${posY}"]`);
          if ($(position).is('.miss') || $(position).is('.killed')) {
            this.compShot();
          }
      }
      setTimeout(() => { 
        this.onShot(position, 'comp');
      }, 1000)
    },

    onShot(position, type) {
      let target = $(position);
      if (target.is(".cell")  ) {
        if (target.is(".clean")) {
          let ship = target.data("ship");
          if (!ship) {
            this.onShotMiss(target, type);
          } else {
            ship.shot();
            if (!ship.isKilled()) {
              this.onShotDamaged(target, type);
            } else {
              this.onShotKilled(ship, type);
              if (type) {
                if (this.shipsDamaged.length) {
                  this.shipsDamaged = [];
                }
                if (this.shipsFutureShots.length) {
                  this.shipsFutureShots = [];
                }
                this.score.compDecrease(ship.type);
                if ( !this.score.isAllCompShipsDestroyed() ) {
                  this.compShot();
                }
              } else {
                this.score.playerDecrease(ship.type);
              }
            }
          }
          if (type) {
            if ( this.score.isAllCompShipsDestroyed() ) {
              this.statusArea
                .removeClass("status-win status-playing")
                .addClass("status-lose")
                .html("Победил компьютер");
            }
          } else {
            if ( this.score.isAllPlayerShipsDestroyed() ) {
              this.statusArea
                .removeClass("status-lose status-playing")
                .addClass("status-win")
                .html("Вы победили");
            }
          }
        }
      }
    },

    onShotMiss(target, type) {
      if (type) {
        let self = this;
        this.playerShot(self);
      } else {
        this.compShot();
        this.isDamaged = false;
      }
      target
        .removeClass("clean")
        .addClass("miss");
    },

    onShotDamaged(target, type) {
      this.isDamaged = true;
      target
        .removeClass("clean ship")
        .addClass("damaged");
      if (type) {
        if (this.shipsDamaged.length) {
          this.shipsDamaged = [];
        }
        this.compShot();
      }
    },

    onShotKilled(ship, type) {

      let fieldType;
      
      if (type) {
        fieldType = $('._player .seabattle-arena');
      } else {
        fieldType = $('._comp .seabattle-arena');
      }

      let shipCells = $('.cell', $(fieldType)).filter(function() {
        return $(this).data("ship") == ship;
      });

      for (let i = 0; i < shipCells.length; i++) {
        let x = +$(shipCells[i]).attr('x');
        let y = +$(shipCells[i]).attr('y');
        for (let i = x - 1; i < x + 2; i++) {
          for (let j = y - 1; j < y + 2; j++) {
            $(`[x="${i}"][y="${j}"]`, $(fieldType)).removeClass("clean damaged ship").addClass("miss");
          }
        }
      }

      this.isDamaged = false;

      shipCells
        .removeClass("clean damaged ship")
        .addClass("killed");
    },
    
  };

})(jQuery);
