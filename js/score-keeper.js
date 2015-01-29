define([], function () {

var score = 0, highScore = localStorage.getItem('highScore') || 0;

return {
	getScore: function () {
		return score;
	},
	setScore: function (val) {
		score = val;
	},
	getHighScore: function () {
		return highScore;
	},
	isHighScore: function () {
		if (score > highScore) {
			return true;
		} else {
			return false;
		}
	},
	saveAsHighScore: function () {
		localStorage.setItem('highScore', score);
	}
};

});