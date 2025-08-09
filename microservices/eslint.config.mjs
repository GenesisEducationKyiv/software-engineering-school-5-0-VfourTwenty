import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    {
        ignores: ['scripts/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            js,
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/comma-dangle': ['error', 'only-multiline'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/space-before-blocks': ['error', 'always'],
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
            '@stylistic/brace-style': ['error', 'allman'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
            '@stylistic/max-len': ['warn', { code: 150, ignoreUrls: true }],
            '@stylistic/padded-blocks': ['error', { blocks: 'never' }],
            '@stylistic/lines-between-class-members': ['error', 'always']
        },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.browser
            },
        },
    },
    {
        files: ['**/*.test.js'],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    },
    // Disable no-unused-vars for all interface files and mocks
    {
        files: ['**/*Interface.js', '**/*mock.js'],
        rules: {
            'no-unused-vars': 'off',
        },
    },
]);
