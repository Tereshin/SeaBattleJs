Game.Score = function(shipTypes) {
	var self = this;
	this.playerShipTypes = Object.assign({}, shipTypes);
	this.compShipTypes = Object.assign({}, shipTypes);
	this.playerShipsCount = 0;
	this.compShipsCount = 0;
	this.shipsCountTotal = 0;
	this.reset();
};

Game.Score.prototype = {
		
	playerDecrease(type) {
		this.playerShips[type]--;
		this.playerShipsCount --;
	},

	compDecrease(type) {
		this.compShips[type]--;
		this.compShipsCount --;
	},
	
	isAllCompShipsDestroyed() {
		return this.compShipsCount == 0;
	},

	isAllPlayerShipsDestroyed() {
		return this.playerShipsCount == 0;
	},
	
	reset() {
		this.playerShips = {};
		this.compShips = {};
		this.playerShipsCount = 0;
		this.compShipsCount = 0;
		this.goodShotsCount = 0;
		for (type in this.playerShipTypes) {
			var shipItem = this.playerShipTypes[type];
			var count = shipItem[1];
			this.playerShips[type] = count;
			this.playerShipsCount += count;
		}
		for (type in this.compShipTypes) {
			var shipItem = this.compShipTypes[type];
			var count = shipItem[1];
			this.compShips[type] = count;
			this.compShipsCount += count;
		}
	}
	
};