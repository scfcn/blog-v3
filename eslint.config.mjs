import antfu from '@antfu/eslint-config'

export default antfu({
	ignores: ['*.yaml', 'scripts/**', 'content/**'],
	stylistic: {
		indent: 'tab',
	},
	pnpm: true,
	rules: {
		'jsonc/indent': ['error', 2],
		'vue/block-lang': ['warn', {
			script: { lang: ['ts', 'tsx'] },
			style: { lang: ['scss'] },
		}],
		'vue/enforce-style-attribute': ['warn', {
			allow: ['scoped'],
		}],
		'vue/html-indent': ['error', 'tab', { baseIndent: 0 }],
		'yaml/indent': ['error', 2],
	},
}, {
	files: ['**/*.json'],
	ignores: ['content/**'],
	rules: {
		'style/eol-last': ['warn', 'never'],
	},
}, {
	files: ['content/**'],
	rules: {
		'antfu/consistent-list-newline': 'off',
		'eqeqeq': 'off',
		'jsonc/comma-dangle': ['warn', 'always'],
		'jsonc/no-irregular-whitespace': 'off',
		'no-irregular-whitespace': 'off',
		'no-unused-vars': 'off',
		'no-sequences': 'off',
		'prefer-arrow-callback': 'off',
		'prefer-template': 'off',
		'style/indent': 'off',
		'style/quotes': 'off',
		'style/semi': 'off',
		'unicorn/prefer-includes': 'off',
	},
})
