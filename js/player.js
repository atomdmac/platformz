define(
['lib/jaws'],
function (jaws) {

var Player = function (config) {
	config = config || {};

	config.color = 'green';

	jaws.Sprite.call(this, config);
};

Player.prototype = Object.create(jaws.Sprite.prototype);

return Player;

});