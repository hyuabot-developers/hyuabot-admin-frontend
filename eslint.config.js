import js from '@eslint/js'
import globals from 'globals'
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react': eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'semi': ['error', 'never'],
            'indent': ['error', 4],
            ...eslintPluginReact.configs.flat.recommended.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,
            'react/jsx-uses-vars': 'error',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off',
        },
    },
)
