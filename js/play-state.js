define(
['lib/jaws', 'player', 'map'],
function (jaws, Player, Map) {

var player, viewport, map;

// PLEASE CLEAN THIS UP
function collide (spr1, spr2) {
	var rect1 = spr1.rect(),
		rect2 = spr2.rect();
  return ((rect1.x > rect2.x && rect1.x < rect2.right) || (rect2.x > rect1.x && rect2.x < rect1.right)) &&
         ((rect1.y > rect2.y && rect1.y < rect2.bottom) || (rect2.y > rect1.y && rect2.y < rect1.bottom));
}

return {

	setup: function () {
		player = new Player({
			x: 0,
			y: 0,
			width: 50,
			height: 50
		});
		player.y = jaws.height - player.height - 100;

		viewport = new jaws.Viewport({
			x: 0,
			y: 0
		});

		map = new Map({viewport: viewport});
	},

	update: function () {

		// Handle input;
		if(jaws.pressed('left')) {
			player.moveLeft();
		} else if(jaws.pressed('right')) {
			player.moveRight();
		} else {
			player.stayStill();
		}

		if(jaws.pressed('up')) {
			player.jump();
		}

		
		// Update map and entities.
		map.update();
		
		// Run physics sim.
		this.simulatePhysics();

		// Move viewport.
		if(player.y < viewport.y + 200 && player.vy < 0) {
			viewport.y = player.y - 200;
		}
	},

	simulatePhysics: function () {

		var i, platform, collided = false;

		player.updateX();
		for(i=0; i<map.platforms.length; i++) {
			platform = map.platforms[i];

			if(collide(player, platform)) {
				
				collided = true;
				
				// Moving right.
				if (player.vx > 0 && player.x < platform.x) {
					player.x = platform.x - player.width;
				} 

				// Moving left;
				else if (player.vx < 0 && player.x + player.width > platform.x + platform.width) {
					player.x = platform.x + platform.width;
				}
				break;
			}
		}

		player.updateY();
		for(i=0; i<map.platforms.length; i++) {
			
			platform = map.platforms[i];

			if(jaws.collide(player, platform)) {
				
				collided = true;

				// Moving down.
				if(player.vy > 0) {
					// player.y = platform.y - player.height;
					player.setBottom(platform.y);
					// Not falling anymore.
					player.land();
				}

				// Moving up.
				else if(player.vy < 0) {
					player.y = platform.y + platform.height;
					player.vy = 0;
					player.fall();
				}
				break;
			}
		}

		if(!collided) player.fall();

	},

	checkCollisions: function () {
		var platform, collided;
		for(var i=0; i<map.platforms.length; i++) {
			platform = map.platforms[i];

			// y-axis collision.
			player.updateY();
			if(jaws.collide(player, platform)) {
				// We have collided.
				collided = true;

				// Moving down.
				if(player.vy > 0) {
					// player.y = platform.y - player.height;
					player.setBottom(platform.y);
					// Not falling anymore.
					player.land();
				}

				// Moving up.
				else if(player.vy < 0) {
					player.y = platform.y + platform.height;
					player.vy = 0;
					player.fall();
				}
			}

			// x-axis collision.
			player.updateX();
			/*
			if(jaws.collide(player, platform)) {
				collided = true;
				// Moving right.
				if (player.vx > 0 && player.x < platform.x) {
					player.x = platform.x - player.width;
				} 

				// Moving left;
				else if (player.vx < 0 && player.x + player.width > platform.x + platform.width) {
					player.x = platform.x + platform.width;
				}
			}
			*/
			
			if(collided) break;
		}

		if(!collided) player.fall();
	},

	draw: function () {
		jaws.clear();
		viewport.draw(player);
		map.draw();
	}
};

});