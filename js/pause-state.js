define(
['lib/jaws'],
function (jaws) {

return {
	setup: function () {},
	update: function () {
		if(jaws.pressedWithoutRepeat('p')) {
			jaws.switchGameState(jaws.previous_game_state);
		}
	},
	draw: function () {
		// To prevent infinite loops in cases where game state is changed during
		// the update() phase, make sure that jaws.previous_game_state isn't
		// pointing to this object.  This happens because draw() will still be
		// called on the current game state before the switch to the next game
		// state is made.  See GameLoop.loop() for details.
		if(jaws.previous_game_state !== this) {
			jaws.previous_game_state.draw();
		}

		var context = jaws.context;
		context.font = "20px Arial";
		context.fillStyle = 'gray';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText('PAUSED ', jaws.width / 2, jaws.height / 2);
	}
};

});