require.config({
	baseUrl: 'js',
	paths: {
		'lodash': {

		}
	},
	map: {
		'lib/machina': {
			'lodash': 'lib/lodash'
		}
	},
	shim: {
		'lib/jaws': {
			exports: 'jaws'
		}
	}
});

require(
['lib/jaws', 'play-state'],
function (jaws, playState) {

	jaws.start(playState);

});