Game.Comp = function(sizeX, sizeY, shipTypes) {

  this.body = document.getElementById('comp-arena');
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.shipTypes = shipTypes;

  this.templateCell = this.body.getElementsByClassName('clean')[0].cloneNode();
  this.templateRow = this.body.getElementsByClassName('row')[0].cloneNode();
  this.templateRow.innerHTML = null;

  this.init();
  this.body.classList.remove("hidden");
  
};

Game.Comp.prototype = {

  init() {
    
    this.buildBody();
    this.placeShips(this.shipTypes);

  },

  buildBody() {
    this.body.innerHTML = null;
    for (let posY = 0; posY < this.sizeY; posY++) {
      let row = this.templateRow.cloneNode();
      for (let posX = 0; posX < this.sizeX; posX++) {
        let cell = this.templateCell.cloneNode();
        cell.dataset.posX = posX;
        cell.dataset.posY = posY;
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
      
    } while ( !placed );
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
        // let ship = new Game.Ship(type, size);
        let ship = {
          type: type,
          shotCount: 0,
          size: size,
          id: i
        }
        this.placeShip(ship, shipsMap);
      }
    }
    return shipsMap;
  },
  
  placeShips(shipTypes) {
    let self = this;
    let shipsMap = this.makeShipsMap(shipTypes);
    let cells = this.body.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      let cellPosX = cells[i].dataset.posX;
      let cellPosY = cells[i].dataset.posY;
      let ship = shipsMap[cellPosX][cellPosY];
      // if (ship) {
      //   cells[i].classList.add("ship");
      // }
      cells[i].dataset.ship = JSON.stringify(ship);
    }
  }
  
};