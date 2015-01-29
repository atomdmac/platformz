define(
['lib/jaws', 'lib/machina'],
function (jaws, machina) {

var MAX_SPEED = 6;
var JUMP_VELOCITY = 20;
var GRAVITY = 0.75;

var Player = function (config) {
	config = config || {};

	config.color = 'green';
	jaws.Sprite.call(this, config);

	this.vx = 0;
	this.vy = 0;
	this.ax = 0.5;
	this.ay = GRAVITY;

	// Keep track of the highest point that the player gets to during a jump.
	this.highest = 0;

	var self = this;
	this.jumpFsm = new machina.Fsm({
		initialState: 'falling',
		states: {
			'falling': {
				_onEnter: function () {
					self.highest = self.y + self.height;
				},

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.vy += self.ay;
				}
			},

			'grounded': {
				_onEnter: function () {
					self.vy = 0;
					self.highest = 0;
				},

				jump: function () {
					this.transition('jumping');
				}
			},

			'jumping': {
				_onEnter: function () {
					self.vy = -JUMP_VELOCITY;
				},

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.vy += self.ay;

					if(self.vy > 0) {
						this.transition('falling');
					}
				},
			}
		}
	});

	// Print transitions to console for debugging.
	this.jumpFsm.on('transition', function (data) {
		console.log(data.toState);
	});

	// State machine for horizontal movement.
	this.horiMove = new machina.Fsm({
		initialState: 'still',
		states: {
			movingLeft: {
				update: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				},
				collide: function (item) {
					self.x += self.vx;
				}
			},

			movingRight: {
				update: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				},
				collide: function (item) {
					self.x -= self.vx;
				}
			},

			still: {
				update: function () {
					self.vx = 0;
				}
			}
		}
	});
};

Player.prototype = Object.create(jaws.Sprite.prototype);

Player.prototype.update = function () {
	this.jumpFsm.handle('update');
	this.horiMove.handle('update');
	this.y += this.vy;
	this.x += this.vx;
};

Player.prototype.jump = function () {
	this.jumpFsm.handle('jump');
};

Player.prototype.fall = function () {
	this.jumpFsm.transition('falling');
};

Player.prototype.land = function () {
	this.jumpFsm.transition('grounded');
};

Player.prototype.moveLeft = function () {
	this.horiMove.transition('movingLeft');
};

Player.prototype.moveRight = function () {
	this.horiMove.transition('movingRight');
};

Player.prototype.stayStill = function () {
	this.horiMove.transition('still');
};

Player.prototype.collide = function (item) {
	this.jumpFsm.handle('collide', {item: item});
};

return Player;

});