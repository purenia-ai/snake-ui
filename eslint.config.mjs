import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const uniAppGlobals = {
    uni: 'readonly',
    wx: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    plus: 'readonly'
};

export default tseslint.config(
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/unpackage/**',
            '**/.vitepress/cache/**',
            '**/.vitepress/dist/**',
            '**/*.min.js',
            '**/*.map'
        ]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue']
            }
        }
    },
    {
        files: ['**/*.{js,cjs,mjs,ts,vue}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...uniAppGlobals
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'vue/attribute-hyphenation': 'off',
            'vue/attributes-order': 'off',
            'vue/component-definition-name-casing': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'off',
            'vue/order-in-components': 'off',
            'vue/require-default-prop': 'off'
        }
    },
    {
        files: ['**/*.{ts,vue}'],
        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-unused-expressions': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
        }
    },
    {
        files: ['**/*.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    },
    {
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    prettier
);
