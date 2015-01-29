define(['lib/jaws', 'score-keeper'], function (jaws, ScoreKeeper) {

return {
	setup: function () {},
	update: function () {},
	draw: function () {
		// jaws.previous_game_state.draw();

		var context = jaws.context;
		// context.fillStyle = 'rgba(0, 0, 0, 0.01)';
		context.fillStyle = 'red';
		context.rect(0, 0, jaws.width, jaws.height);
		context.globalAlpha = 0.01;
		context.fill();
		context.globalAlpha = 1;

		context.fillStyle = '#fff';
		context.font = '25px Arial';
		context.textAlign = 'center';
		context.fillText('YOU FUCKIN\' DIED!', jaws.canvas.width / 2, jaws.canvas.height / 2);

		
		context.font = '20px Arial';
		if(ScoreKeeper.isHighScore()) {
			context.fillText('But at least you beat your last high score!', jaws.canvas.width / 2, jaws.canvas.height / 2 + 30);
		} else {
			context.fillText('...And you didn\'t even beat your last high score...', jaws.canvas.width / 2, jaws.canvas.height / 2 + 30);
		}

	}
};

});