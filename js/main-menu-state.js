define(
['lib/jaws', 'lib/machina', 'play-state', 'lib/tamepad'],
function (jaws, machina, PlayState, Tamepad) {

	console.log('Menu');

var MainMenuState = function () {
	this.items = ['Start Game', 'Clear High Score', 'Credits'];

	this.setup = function () {};
	this.update = function () {
		if(!this.checkGamepadInput()) this.checkKeyboardInput();
	};

	this.checkGamepadInput = function () {
		var hasInput = false,
			tamepad  = Tamepad.get('player');
		if(tamepad) {
			tamepad.update();
			if(tamepad.pressedWithoutRepeat(9)) {
				jaws.switchGameState(PlayState);
				hasInput = true;
			}
		}
		return hasInput;
	};

	this.checkKeyboardInput = function () {
		var hasInput = false;
		if(jaws.pressedWithoutRepeat('space')) {
			jaws.switchGameState(PlayState);
			hasInput = true;
		}
		return hasInput;
	};

	this.draw = function () {
		jaws.clear();

		var context = jaws.context;

		context.beginPath();
		context.fillStyle = '#595959';
		context.rect(0, 0, jaws.width, jaws.height);
		context.fill();

		context.font = '40pt Arial';
		context.fillStyle = '#4F81FE';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText('Press any key to start', jaws.width / 2, jaws.height / 2);
	};
};

return MainMenuState;

});