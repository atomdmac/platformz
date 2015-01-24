define(
['lib/jaws', 'utils', 'platform'],
function (jaws, utils, Platform) {

var PLATFORM_HEIGHT = 10,
	PLATFORM_MIN_SPACING = 60;

var Map = function (config) {
	this.viewport = config.viewport;
	this.platforms = [];
	this.initialize();
};

Map.prototype.initialize = function () {
	this.createGround();
	
	while(this.platforms[this.platforms.length - 1].y > 0) {
		this.createPlatform(this.platforms[this.platforms.length - 1].y - PLATFORM_MIN_SPACING);
	}
};

Map.prototype.update = function () {
	// Prune platforms that have fallen off the screen.
	this.prunePlatforms();

	// Create more platforms if necessary.
	if(this.canCreatePlatform()) {
		this.createPlatform(this.viewport.y);
	}
};

Map.prototype.draw = function () {
	for(var i=0; i<this.platforms.length; i++) {
		this.viewport.draw(this.platforms[i]);
	}
};

Map.prototype.canCreatePlatform = function () {
	var roll = utils.randomInt(0, 100),
		minDistance,
		platform = this.platforms[this.platforms.length - 1];

	if(!platform) {
		return true;
	} else if(Math.abs(this.viewport.y - platform.y) > PLATFORM_MIN_SPACING && roll > 70) {
		return true;
	} else {
		return false;
	}
};

Map.prototype.createPlatform = function (y) {
	var w = utils.randomInt(25, jaws.width / 3),
		h = 10,
		x = utils.randomInt(0, jaws.width - w);
	
	// Mostly for adding random platforms as the player ascends.
	y = y - h;

	this.platforms.push(new Platform({
		x: x,
		y: y,
		width: w,
		height: h
	}));
};

Map.prototype.createGround = function () {
	var w = jaws.width,
		h = 10,
		x = 0,
		y = this.viewport.height + this.viewport.y - h;
	this.platforms.push(new Platform({
		x: x,
		y: y,
		width: w,
		height: h
	}));
};

Map.prototype.prunePlatforms = function () {
	var i = this.platforms.length - 1;
		platform = null;
	for(; i>0; i--) {
		platform = this.platforms[i];
		if(!this.viewport.isPartlyInside(platform)) {
			this.platforms.splice(i, 1);
		}
	}
};

return Map;

});