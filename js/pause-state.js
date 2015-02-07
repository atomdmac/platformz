define(
['lib/jaws', 'lib/tamepad'],
function (jaws, Tamepad) {

return {
	alpha: 0,
	setup: function () {
		this.alpha = 0;
	},
	update: function () {
		if(!this.checkGamepadInput()) this.checkKeyboardInput();
	},

	checkGamepadInput: function () {
		var hasInput = false,
			tamepad  = Tamepad.get('player');
		if(tamepad) {
			tamepad.update();
			if(tamepad.pressedWithoutRepeat(9)) {
				jaws.switchGameState(jaws.previous_game_state);
				hasInput = true;
			}
		}
		return hasInput;
	},

	checkKeyboardInput: function () {
		var hasInput = false;
		if(jaws.pressedWithoutRepeat('p')) {
			jaws.switchGameState(jaws.previous_game_state);
			hasInput = true;
		}
		return hasInput;
	},

	draw: function () {
		// To prevent infinite loops in cases where game state is changed during
		// the update() phase, make sure that jaws.previous_game_state isn't
		// pointing to this object.  This happens because draw() will still be
		// called on the current game state before the switch to the next game
		// state is made.  See GameLoop.loop() for details.
		if(jaws.previous_game_state !== this) {
			// jaws.previous_game_state.draw();
		}

		if(this.alpha < 1) {
			this.alpha += 0.2;

			var context = jaws.context;
			context.fillStyle = '#4B597D';
			context.rect(0, 0, jaws.width, jaws.height);
			context.globalAlpha = this.alpha * 0.35;
			context.fill();
			
			context.globalAlpha = 1;
			context.font = "20px Arial";
			context.fillStyle = '#CDCDCD';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText('PAUSED ', jaws.width / 2, jaws.height / 2);
		}
	}
};

});