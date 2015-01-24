define([], function () {
	return {
		randomInt: function (min, max) {
			return Math.round(Math.random() * (max - min)) + min;
		}
	};
});