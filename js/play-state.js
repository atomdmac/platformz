define(
['lib/jaws', 'player', 'map'],
function (jaws, Player, Map) {

var player, viewport, map;

return {

	setup: function () {
		player = new Player({
			x: 0,
			y: 0,
			width: 50,
			height: 50
		});
		player.y = jaws.height - player.height;

		viewport = new jaws.Viewport({
			x: 0,
			y: 0
		});

		map = new Map({viewport: viewport});
	},

	update: function () {
		map.update();
		// viewport.y -= 1;
	},

	draw: function () {
		jaws.clear();
		// viewport.draw(player);
		map.draw();
	}
};

});