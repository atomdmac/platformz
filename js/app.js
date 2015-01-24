require.config({
	baseUrl: 'js',
	paths: {},
	shim: {
		'lib/jaws': {
			exports: 'jaws'
		}
	}
});

require(
['lib/jaws', 'play-state'],
function (jaws, playState) {

	jaws.init({width: 300, height: 500});
	jaws.start(playState);

});