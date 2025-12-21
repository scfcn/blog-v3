module.exports = {
	extends: '@zinkawaii/stylelint-config',
	rules: {
		// 允许第三方库生成的类选择器，如 Element Plus 和 Twikoo
		'selector-class-pattern': null,
	},
}
