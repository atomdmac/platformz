define(
['lib/jaws', 'lib/machina'],
function (jaws, machina) {

var JUMP_VELOCITY = 20;
var JUMP_MAX_REPEAT = 2;
var Y_ACCEL = 0.75;
var X_ACCEL = 0.6;
var MAX_X_SPEED = 6;
var FRICTION = 0.3;

var Player = function (config) {
	config = config || {};

	config.color = '#FF9773';
	jaws.Sprite.call(this, config);

	this.vx = 0;
	this.vy = 0;
	this.ax = X_ACCEL;
	this.ay = Y_ACCEL;

	// Keep track of the highest point that the player gets to during a jump.
	this.highest = 0;
	
	// Jump streak experiment.
	this.jumpCount = 0;

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
					if (self.jumptCount < JUMP_MAX_REPEAT) {
						self.jumptCount++;
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
					self.jumptCount = 0; // Reset jump streak.
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

Player.prototype.draw = function () {
	jaws.context.save();
	jaws.context.fillStyle = this.color;
	jaws.context.lineWidth = 1;
	roundRect(jaws.context, this.x, this.y, this.width, this.height, 5, true, false);
	jaws.context.restore();
};

/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}

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