import zin from '@zinkawaii/stylelint-config'

export default zin({
	rules: {
		'@stylistic/indentation': 'tab',
		'media-feature-range-notation': 'prefix',
		'selector-class-pattern': null,
		'keyframes-name-pattern': null,
		'custom-property-pattern': null,
		'declaration-property-value-keyword-no-deprecated': null,
		'custom-property-empty-line-before': null,
	},
})
