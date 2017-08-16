Game.Battle = function(sizeX, sizeY, shipTypes) {

  this.sizeX = sizeX;
  this.sizeY = sizeY;

  this.player = document.getElementById('player-arena');
  this.comp = document.getElementById('comp-arena');

  this.statusArea = document.getElementById("seabattle-status");

  this.isDamaged = false;

  this.shipTypes = shipTypes;

  this.shipsDamaged = [];
  this.shipsFutureShots = [];

  this.score = new Game.Score(this.shipTypes);

  this.init();

  this.onShot = this.onShot.bind(this);
  
};

Game.Battle.prototype = {

  init() {
    let self = this;

    this.playerShot();

    this.score.reset();
    this.statusArea.classList.remove("status-win", "status-lose")
    this.statusArea.classList.add("status-playing");
    this.statusArea.innerHTML = "Идет игра";

  },

  playerShot() {
    this.comp.addEventListener('click', (event) => {
      let position = event.target;
      this.onShot(position);
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
    // console.log("Возможные выстрелы без предыдущего выстрела: ", this.shipsFutureShots);
    let posX = coordinates[0];
    let posY = coordinates[1];
    let position = this.player.querySelector(`[data-pos-x="${posX}"][data-pos-y="${posY}"]`);
    return position;
  },

  compShot() {
    let position,
        posX,
        posY;

    if (this.shipsDamaged.length) {
      this.shipsDamaged = [];
    }

    let damagedShip = this.player.getElementsByClassName("damaged");
    console.log(damagedShip);
    if (damagedShip.length) {
      for (let i = 0; i < damagedShip.length; i++) {
        console.log(damagedShip[i]);
        posX = damagedShip[i].dataset.posX;
        posY = damagedShip[i].dataset.posY;
        this.shipsDamaged.push([+posX, +posY]);
      }
      // damagedShip.forEach((item) => {
      //   posX = item.dataset('posX');
      //   posY = item.dataset('posY');
      //   this.shipsDamaged.push([+posX, +posY]);
      // })
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
            let position = this.player.querySelector(`[data-pos-x="${item[0]}"][data-pos-y="${item[1]}"]`);
            return !position.classList.contains('.miss');
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
              let position = this.player.querySelector(`[data-pos-x="${item[0]}"][data-pos-y="${item[1]}"]`);
              return !position.classList.contains('miss');
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
              let position = this.player.querySelector(`[data-pos-x="${item[0]}"][data-pos-y="${item[1]}"]`);
              return !position.classList.contains('.miss');
            });
            position = this.compNextShot();
          }
        }
      }
    } else {
        let posX = Math.floor( Math.random() * this.sizeX );
        let posY = Math.floor( Math.random() * this.sizeY );
        position = this.player.querySelector(`[data-pos-x="${posX}"][data-pos-y="${posY}"]`);
        if (position.classList.contains('miss') || position.classList.contains('killed')) {
          this.compShot();
        }
    }
    setTimeout(() => { 
      this.onShot(position, 'comp');
    }, 1000)
  },

  onShot(position, type) {
    let target = position;
    if (target.classList.contains("cell")) {
      if (target.classList.contains("clean")) {
        if (target.dataset.ship != "undefined") {
          // console.log(target)
          let arena = target.closest(".seabattle-arena");
          // arena.
          let ship = JSON.parse(target.dataset.ship);
          if (ship.shotCount < ship.size) {
            console.log(ship.shotCount++);
            // ship.shotCount++;
          }
          target.dataset.ship = JSON.stringify(ship);
          ship = JSON.parse(target.dataset.ship);
          console.log(ship);
          if (!(ship.shotCount >= ship.size)) {
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
        } else {
          this.onShotMiss(target, type);
        }
        if (type) {
          if ( this.score.isAllCompShipsDestroyed() ) {
            this.statusArea.classList.remove("status-win", "status-playing")
            this.statusArea.classList.add("status-lose");
            this.statusArea.innerHTML = "Победил компьютер";
          }
        } else {
          if ( this.score.isAllPlayerShipsDestroyed() ) {
            this.statusArea.classList.remove("status-lose", "status-playing")
            this.statusArea.classList.add("status-win");
            this.statusArea.innerHTML = "Вы победили";
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
    target.classList.remove("clean");
    target.classList.add("miss");
  },

  onShotDamaged(target, type) {
    this.isDamaged = true;
    target.classList.remove("clean", "ship");
    target.classList.add("damaged");
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
      fieldType = this.player;
    } else {
      fieldType = this.comp;
    }

    let shipCells = fieldType.getElementsByClassName('cell').filter(function() {
      return $(this).data("ship") == ship;
    });

    for (let i = 0; i < shipCells.length; i++) {
      let x = +shipCells[i].dataset.posX;
      let y = +shipCells[i].dataset.posY;
      for (let i = x - 1; i < x + 2; i++) {
        for (let j = y - 1; j < y + 2; j++) {
          let target = fieldType.querySelector(`[data-pos-x="${i}"][data-pos-y="${j}"]`);
          target.classList.remove("clean damaged ship");
          target.classList.add("miss");
        }
      }
    }

    this.isDamaged = false;

    shipCells.classList.remove("clean", "ship", "damaged");
    shipCells.classList.add("killed");
  },
  
};