define(
['lib/jaws', 'player', 'map', 'death-state', 'score-keeper'],
function (jaws, Player, Map, DeathState, ScoreKeeper) {

var player, viewport, map, score;

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
		this.updatePlayer();
		this.updateBombs();
		this.collideBombs();

		// Move viewport.
		if(player.y < viewport.y + 200 && player.vy < 0) {
			viewport.y = player.y - 200;
		}

		this.checkDeath();
		this.updateScore();
	},

	updateScore: function () {
		ScoreKeeper.setScore(Math.floor(viewport.y * -1));
	},

	checkDeath: function () {
		if (player.y > viewport.y + viewport.height) {
			// Save score if necessary.
			if(ScoreKeeper.isHighScore()) {
				ScoreKeeper.saveAsHighScore();
			}
			jaws.switchGameState(DeathState);
		}
	},

	updatePlayer: function () {
		player.update();
		this.simulatePhysics(player);
	},

	updateBombs: function () {
		var bombs = map.bombs, i;
		for(i=0; i<bombs.length; i++) {
			bombs[i].update();
			this.simulatePhysics(bombs[i]);
		}
	},

	simulatePhysics: function (item) {
		var i, platform, collided = false;
		for(i=0; i<map.platforms.length; i++) {
			
			platform = map.platforms[i];

			if(jaws.collide(item, platform)) {
				
				collided = true;

				// Moving down.
				if(item.vy > 0 && item.highest < platform.y) {
					// item.y = platform.y - item.height;
					item.setBottom(platform.y);
					// Not falling anymore.
					item.land();
				}
				break;
			}
		}

		if(!collided && item.fsm.state != 'jumping') item.fall();
	},

	collideBombs: function () {
		var i, bomb;
		for(i=0; i<map.bombs.length; i++) {
			bomb = map.bombs[i];
			if(jaws.collide(player, bomb)) {
				player.knockBack(bomb);
				break;
			}
		}
	},

	drawScores: function () {
		// Draw score.
		var context = jaws.context;
		context.font = "22px Arial";
		context.fillStyle = ScoreKeeper.isHighScore() ? 'green' : 'red';
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.fillText('Score: ' + ScoreKeeper.getScore(), 0, 0);

		// Draw high-score
		context.font = "20px Arial";
		context.fillStyle = 'gray';
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.fillText('Score to Beat: ' + ScoreKeeper.getHighScore(), 0, 40);
	},

	draw: function () {
		jaws.clear();
		map.draw();
		viewport.draw(player);
		this.drawScores();
	}
};

});