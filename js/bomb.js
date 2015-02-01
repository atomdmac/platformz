define(
['lib/jaws', 'lib/machina'],
function (jaws, machina) {

var MAX_SPEED = 2;
var GRAVITY = 0.25;

var Bomb = function (config) {
	config = config || {};

	config.color = '#FF6D3A';
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

Bomb.prototype.draw = function () {
	jaws.context.fillStyle = this.color;
	roundRect(jaws.context, this.x, this.y, this.width, this.height, 5, true, false);
};

return Bomb;

});