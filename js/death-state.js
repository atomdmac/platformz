define(
['require', 'lib/jaws', 'score-keeper', 'utils', 'lib/tamepad', 'play-state'], 
function (require, jaws, ScoreKeeper, utils, Tamepad) {

return {
	alpha: 0,
	shame: ['Are you kidding me?!', 'Well, at least you tried.  I guess.', 'Well, that was shameful.'],
	message: null,
	setup: function () {
		this.alpha = 0;
		this.message = this.shame[utils.randomInt(0, this.shame.length-1)];
	},
	update: function () {
		if(!this.checkGamepadInput()) this.checkKeyboardInput();
	},

	checkGamepadInput: function () {
		var hasInput = false,
			tamepad = Tamepad.get('player');
		if(tamepad) {
			tamepad.update();
			if(tamepad.pressedWithoutRepeat(9)) {
				jaws.switchGameState(require('play-state').initialize());
				hasInput = true;
			}
		}
		return hasInput;
	},

	checkKeyboardInput: function () {
		var hasInput = false;
		if(jaws.pressedWithoutRepeat('space')) {
			jaws.switchGameState(require('play-state').initialize());
			hasInput = true;
		}
		return hasInput;
	},

	draw: function () {
		
		if(this.alpha < 1) {
			this.alpha += 0.1;
	
			jaws.clear();
			jaws.previous_game_state.draw();
			
			var context = jaws.context;

			// context.globalCompositeOperation = 'lighter';
			context.fillStyle = '#FF6C3A';
			context.rect(0, 0, jaws.width, jaws.height);
			context.globalAlpha = this.alpha * 0.7;
			context.fill();
			context.globalAlpha = 1;
			// context.globalCompositeOperation = 'source-over';

			context.fillStyle = '#000';
			context.font = '25px Arial';
			context.textAlign = 'center';
			context.fillText(this.message, jaws.canvas.width / 2, jaws.canvas.height / 2);
			
			context.font = '20px Arial';
			if(ScoreKeeper.isHighScore()) {
				context.fillText('But at least you beat your last high score!', jaws.canvas.width / 2, jaws.canvas.height / 2 + 30);
			} else {
				context.fillText('...And you didn\'t even beat your last high score...', jaws.canvas.width / 2, jaws.canvas.height / 2 + 30);
			}
		}


	}
};

});