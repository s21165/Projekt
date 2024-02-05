module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{css,js,png,svg}'
	],
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};