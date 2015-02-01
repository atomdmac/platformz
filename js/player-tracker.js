define(
['lib/jaws'],
function (jaws) {

var PlayerTracker = function (options) {
	options = options || {};

	options.color = 'red';
	options.width = 20;
	options.height = 5;
	options.y = 0;
	options.x = 0;

	jaws.Sprite.call(this, options);

	this.target = null;
};

PlayerTracker.prototype = Object.create(jaws.Sprite.prototype);

PlayerTracker.prototype.setTrackTarget = function (target) {
	this.target = target;
};

PlayerTracker.prototype.update = function () {
	if(this.target) {
		this.y = this.target.y + this.target.height / 2;
	}
};

PlayerTracker.prototype.draw = function () {
	if (this.target.x < 0) {
		this.x = 0;
		jaws.Sprite.prototype.draw.call(this);
	}
	if (this.target.x + this.target.width > jaws.width) {
		this.x = jaws.width - this.width;
		jaws.Sprite.prototype.draw.call(this);
	}
};

return PlayerTracker;

});