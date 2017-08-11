(function($) {

  Game.Player = function() {

    this.body = $('._player .seabattle-arena');
    this.sizeX = 10;
    this.sizeY = 10;

    this.isShipsOnPlace = false;
    this.prevCellPos = {};

    this.shipTypes = { 
      "ship-4": [4, 1],
      "ship-3": [3, 2],
      "ship-2": [2, 3],
      "ship-1": [1, 4]
    };

    this.templateCell = $(".clean:first", this.body).clone();
    this.templateRow = $(".row:first", this.body).clone().empty();

    this.init();

    this.body.removeClass("hidden");
    
  };

  Game.Player.prototype = {

    init() {
      this.buildBody();
      this.placeShips(this.shipTypes);
    },

    buildBody() {
      this.body.empty();
      for (let posY = 0; posY < this.sizeY; posY++) {
        let row = this.templateRow.clone();
        for (let posX = 0; posX < this.sizeX; posX++) {
          let cell = this.templateCell.clone();
          cell.data("pos", {"X": posX, "Y": posY});
          row.append(cell);
        }
        this.body.append(row);
      }
    },

    checkBounds(bound, shipsMap) {
      let placed = true;
      for(let curX = bound.left; curX <= bound.right; curX++) {
        for(let curY = bound.up ; curY <= bound.down; curY++) {
          if ( shipsMap[curX][curY] ) {
            placed = false;
            break;
          }
        }
      }
      return placed;
    },
    
    placeShip(ship, shipsMap) {
      
      let size = ship.size;
      let placed = false;
      let posX;
      let posY;
      let direction;
      let countIteration = 100;
      
      do {
        direction = Math.floor( Math.random() * 2 );
        posX = Math.floor( Math.random() * this.sizeX );
        posY = Math.floor( Math.random() * this.sizeY );
        
        if (direction == 0) {
          let maxPosX = posX + size;
          if (maxPosX <= this.sizeX) {
            let bound = {};
      
            bound.left = Math.max(0, posX - 1);
            bound.up = Math.max(0, posY - 1);
            bound.right = Math.min(this.sizeX - 1, maxPosX + 1);
            bound.down = Math.min(this.sizeY - 1, posY + 1);
            
            placed = this.checkBounds(bound, shipsMap);
            if (placed) {
              for (let i = posX; i < maxPosX; i++) {
                shipsMap[i][posY] = ship;
              }
            }
          }
          
        } else {
          let maxPosY = posY + size;
          if (maxPosY <= this.sizeY) {
            let bound = {};
            bound.left = Math.max(0, posX - 1);
            bound.up = Math.max(0, posY - 1);
            
            bound.right = Math.min(this.sizeX - 1, posX + 1);
            bound.down = Math.min(this.sizeY - 1, maxPosY + 1);
            
            placed = this.checkBounds(bound, shipsMap);
            if (placed) {
              for (let i = posY; i < maxPosY; i++) {
                shipsMap[posX][i] = ship;
              }
            }
          }
        }
        
      } while ( !placed && ( (countIteration--) > 0) );
      return placed;
    },

    makeShipsMap(shipTypes) {
      let shipsMap = new Array(this.sizeX);
      for(let i = 0 ; i < this.sizeY; i++) {
        shipsMap[i] = new Array(this.sizeY);
      }
      
      for (type in shipTypes) {
        let shipItem = shipTypes[type];
        let count = shipItem[1];
        let size  = shipItem[0]; 
        for (let i = 0; i < count; i++) {
          let ship = new Game.Ship(type, size);
          this.placeShip(ship, shipsMap);
        }
      }
      return shipsMap;
    },
    
    placeShips(shipTypes) {
      let self = this;
      let shipsMap = this.makeShipsMap(shipTypes);
      $('.cell', this.body).each(function() {
        let cellPos = $(this).data("pos");
        let ship = shipsMap[cellPos.X][cellPos.Y];
        if (ship) {
          $(this).addClass("ship");  
        }
        $(this).data("ship", ship);
        $(this).attr('x', cellPos.X);
        $(this).attr('y', cellPos.Y);
      });
    }





    // ДЛЯ РУЧНОГО РАСПОЛОЖЕНИЯ КОРАБЛЕЙ
    
    // placeShips() {
    //   let self = this;
    //   let generatorShips = this.loopThroughtShips();
    //   let ship = generatorShips.next().value;
    //   this.placeShip(ship);
    // },

    // *loopThroughtTypes() {
    //   for (type in this.shipTypes) {
    //     yield type;
    //   }
    // },

    // *loopThroughtShips() {
    //   let generatorTypes = this.loopThroughtTypes();
    //   let type = generatorTypes.next().value;
    //   let ship = this.shipTypes[type];
    //   let count = ship[1];
    //   let size  = ship[0]; 
    //   for (let i = 0; i < count; i++) {
    //     let ship = new Game.Ship(type, size);
    //     yield ship;
    //   } 
    // },

    // placeShip(ship) {
    //   let self = this;
    //   let shipLength = ship.size;
    //   alert(`Поставьте ${shipLength}-палубный корабль`);
    //   $('.cell', this.body).click((e) => {
    //     if (shipLength) {
    //       let cellPos = $(e.target).data("pos");
    //       let prevCellPos = $.isEmptyObject(self.prevCellPos) ? cellPos : Object.assign({}, self.prevCellPos);
    //       if ((cellPos.X === prevCellPos.X) || (cellPos.Y === prevCellPos.Y)) {
    //         $(e.target).addClass('ship');
    //         self.prevCellPos = Object.assign({}, cellPos);
    //       } else {
    //         alert("Здесь разместить корабль вы не можете");
    //       }
    //     } else {
    //       console.log(self);
    //     }
    //     shipLength--;
    //   })
    // }
    
  };

})(jQuery);
