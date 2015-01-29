define(
['lib/jaws', 'player', 'map', 'death-state'],
function (jaws, Player, Map, DeathState) {

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

		if(jaws.pressedWithoutRepeat('up')) {
			player.jump();
		}

		
		// Update map and entities.
		map.update();
		player.update();

		// Run physics sim.
		this.simulatePhysics();

		// Move viewport.
		if(player.y < viewport.y + 200 && player.vy < 0) {
			viewport.y = player.y - 200;
		}

		this.checkDeath();
	},

	checkDeath: function () {
		if (player.y > viewport.y + viewport.height) {
			jaws.switchGameState(DeathState);
		}
	},

	simulatePhysics: function () {
		var i, platform, collided = false;
		for(i=0; i<map.platforms.length; i++) {
			
			platform = map.platforms[i];

			if(jaws.collide(player, platform)) {
				
				collided = true;

				// Moving down.
				if(player.vy > 0 && player.highest < platform.y) {
					// player.y = platform.y - player.height;
					player.setBottom(platform.y);
					// Not falling anymore.
					player.land();
				}
				break;
			}
		}

		if(!collided && player.jumpFsm.state != 'jumping') player.fall();
	},

	draw: function () {
		jaws.clear();
		map.draw();
		viewport.draw(player);
	}
};

});