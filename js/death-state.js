define(['lib/jaws', 'score-keeper'], function (jaws, ScoreKeeper) {

return {
	alpha: 0,
	setup: function () {
		this.alpha = 0;
	},
	update: function () {},
	draw: function () {
		
		if(this.alpha < 1) {
			this.alpha += 0.1;
	
			jaws.clear();
			jaws.previous_game_state.draw();
			
			var context = jaws.context;
			context.fillStyle = '#FF6C3A';
			context.rect(0, 0, jaws.width, jaws.height);
			context.globalAlpha = this.alpha * 0.85;
			context.fill();
			context.globalAlpha = 1;

			context.fillStyle = '#FFBE3A';
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


	}
};

});