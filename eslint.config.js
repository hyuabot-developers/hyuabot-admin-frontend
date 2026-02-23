import js from '@eslint/js'
import globals from 'globals'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: globals.browser,
        },
        plugins: {
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            'react-refresh': reactRefresh,
            import: importPlugin,
            '@typescript-eslint': tsPlugin,
        },
        // extends 문자열 대신 객체 형태로 기존 recommended 룰 포함
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        rules: {
            /** JS/TS 스타일 */
            semi: ['error', 'never'],
            indent: ['error', 4],
            quotes: ['error', 'single', { avoidEscape: true }],
            'comma-dangle': ['error', 'only-multiline'],
            'no-trailing-spaces': 'error',
            /** import/order */
            'import/order': ['error', {
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            }],
            'object-curly-spacing': ['error', 'always'],
            /** 코드 안전/품질 */
            'no-console': 'warn',
            'prefer-const': 'error',
        },
    },
)
