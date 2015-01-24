define(
['lib/jaws'],
function (jaws) {

var Platform = function (config) {
	config = config || {};

	config.color = '#666';

	jaws.Sprite.call(this, config);
};

Platform.prototype = Object.create(jaws.Sprite.prototype);

return Platform;

});