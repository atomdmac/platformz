define(
['lib/jaws', 'lib/machina'],
function (jaws, machina) {

var JUMP_VELOCITY = 20;
var Y_ACCEL = 0.75;
var X_ACCEL = 5;
var MAX_X_SPEED = 5;
var FRICTION = 0.3;

var Player = function (config) {
	config = config || {};

	config.color = '#4270E3';
	jaws.Sprite.call(this, config);

	this.vx = 0;
	this.vy = 0;
	this.ax = 0.5;
	this.ay = Y_ACCEL;

	// Keep track of the highest point that the player gets to during a jump.
	this.highest = 0;
	
	// Jump streak experiment.
	this.maxJumpStreak = 1;
	this.jumpStreak = 0;

	var self = this;

	this.fsm = new machina.Fsm({
		initialState: 'falling',

		states: {
			'falling': {

				// While falling, move the player toward the ground on every tick.
				update: function () {
					self.highest = self.y + self.height;
					self.vy += self.ay;
				},

				// Attempt to continue your jump streak.
				jump: function () {
					this.transition('streaking');
				},

				left: function () {
					self.vx -= self.ax;
					if(self.vx < -MAX_X_SPEED) self.vx = -MAX_X_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_X_SPEED) self.vx = MAX_X_SPEED;
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
					if(self.vx < -MAX_X_SPEED) self.vx = -MAX_X_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_X_SPEED) self.vx = MAX_X_SPEED;
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
					if(self.vx < -MAX_X_SPEED) self.vx = -MAX_X_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_X_SPEED) self.vx = MAX_X_SPEED;
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
					if(self.vx < -MAX_X_SPEED) self.vx = -MAX_X_SPEED;
				},

				right: function () {
					self.vx += self.ax;
					if(self.vx > MAX_X_SPEED) self.vx = MAX_X_SPEED;
				},

				still: function () {
					// if (self.vx > 0 && self.vx !== 0) self.vx -= self.ax;
					// else if (self.vx < 0 && self.vx !== 0) self.vx += self.ax;
					// else this.vx = 0;
					self.applyFriction();
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

Player.prototype.applyFriction = function () {
	if (this.vx > 0) {
		this.vx -= FRICTION;
	} 

	else if (this.vx < 0) {
		this.vx += FRICTION;
	}

	if(Math.abs(this.vx - FRICTION) < FRICTION) {
		this.vx = 0;
	}
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
	this.fsm.handle('still');
};

Player.prototype.knockBack = function (item) {
	if(this.x - item.x > 0) {
		this.vx = MAX_X_SPEED * 1.8;
	} else {
		this.vx = -MAX_X_SPEED * 1.8;
	}
};

return Player;

});