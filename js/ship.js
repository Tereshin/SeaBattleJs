(function($) {

	Game.Ship = function(type, size) {

		this.type = type;

		this.size = size;

		this.shotCount = 0;
	};

	Game.Ship.prototype = {

		shot : function() {
			if (this.shotCount < this.size) {
				this.shotCount++;
			}
		},

		isKilled : function() {
			return this.shotCount >= this.size;
		}
	};

})(jQuery);
