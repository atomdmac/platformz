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
	
	// Jump streak experiment.
	this.maxJumpStreak = 2;
	this.jumpStreak = 0;

	var self = this;

	this.fsm = new machina.Fsm({
		initialState: 'falling',

		states: {
			'falling': {
				_onEnter: function () {
					self.highest = self.y + self.height;
				},

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.vy += self.ay;
				},

				// Attempt to continue your jump streak.
				jump: function () {
					this.transition('streaking');
				},

				left: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				}
			},

			'jumping': {
				_onEnter: function () {
					self.vy = -JUMP_VELOCITY;
				},

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.vy += self.ay;
					self.highest = self.y + self.height;
					if(self.vy > 0) {
						this.transition('falling');
					}
				},

				// Attempt to continue your jump streak.
				jump: function () {
					this.transition('streaking');
				},

				left: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				}
			},

			'streaking': {
				_onEnter: function () {
					if (self.jumpStreak < self.maxJumpStreak) {
						self.jumpStreak++;
						this.transition('jumping');
					}
				},

				left: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				}
			},

			'grounded': {
				_onEnter: function () {
					self.vy = 0;
					self.highest = 0;
					self.jumpStreak = 0; // Reset jump streak.
				},

				update: function () {
				},

				jump: function () {
					this.transition('jumping');
				},

				left: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_SPEED) self.vx = -MAX_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_SPEED) self.vx = MAX_SPEED;
				},

				still: function () {
					if (self.vx > 0 && self.vx !== 0) self.vx -= self.ax;
					else if (self.vx < 0 && self.vx !== 0) self.vx += self.ax;
					else this.vx = 0;
				}
			}
		}
	});
	
	// Print transitions to console for debugging.
	this.fsm.on('transition', function (data) {
		// console.log(data.toState);
	});
};

Player.prototype = Object.create(jaws.Sprite.prototype);

Player.prototype.update = function () {
	this.fsm.handle('update');
	this.y += this.vy;
	this.x += this.vx;
};

Player.prototype.jump = function () {
	this.fsm.handle('jump');
};

Player.prototype.fall = function () {
	this.fsm.transition('falling');
};

Player.prototype.land = function () {
	this.fsm.transition('grounded');
};

Player.prototype.moveLeft = function () {
	this.fsm.handle('left');
};

Player.prototype.moveRight = function () {
	this.fsm.handle('right');
};

Player.prototype.stayStill = function () {
	// this.horiMove.transition('still');
	this.fsm.handle('still');
};

Player.prototype.knockBack = function (item) {
	if(this.x - item.x > 0) {
		this.vx = MAX_SPEED * 2;
	} else {
		this.vx = -MAX_SPEED * 2;
	}
};

return Player;

});