define(
['lib/jaws', 'lib/machina'],
function (jaws, machina) {

var MAX_SPEED = 2;
var GRAVITY = 0.25;

var Bomb = function (config) {
	config = config || {};

	config.color = 'red';
	jaws.Sprite.call(this, config);

	this.vx = 0;
	this.vy = 0;
	this.ax = 0.5;
	this.ay = GRAVITY;
	this.highest = this.y;

	var self = this;
	this.fsm = new machina.Fsm({
		initialState: 'falling',
		states: {
			'falling': {

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.vy += self.ay;
				}
			},

			'grounded': {
				_onEnter: function () {
					self.vy = 0;
					if(Math.random() > 0.5) {
						this.transition('movingRight');
					} else {
						this.transition('movingLeft');
					}
				}
			},

			'movingRight': {
				update: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				}
			},

			'movingLeft': {
				update: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				}
			}
		}
	});

	this.fsm.on('transition', function (data) {
		// console.log(data.toState);
	});

};

Bomb.prototype = Object.create(jaws.Sprite.prototype);


Bomb.prototype.update = function () {
	this.fsm.handle('update');
	this.y += this.vy;
	this.x += this.vx;
};

Bomb.prototype.fall = function () {
	this.fsm.transition('falling');
};

Bomb.prototype.land = function () {
	this.fsm.transition('grounded');
};

return Bomb;

});