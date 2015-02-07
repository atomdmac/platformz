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
['lib/jaws', 'main-menu-state'],
function (jaws, MainMenuState) {

	jaws.start(new MainMenuState());

});