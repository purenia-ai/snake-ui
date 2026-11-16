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
            '**/*.map',
            // 第三方压缩库内联（农历换算），保持原样
            '**/libs/util/calendar.ts',
            // snake-rich-text 的 App-Plus renderjs 运行时代码是编译产物，与 *.min.js 同等对待
            '**/components/snake-rich-text/static/**'
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
            'vue/block-order': ['error', { order: ['template', ['script', 'script[setup]'], 'style'] }],
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
    {
        // snake-rich-text 是贴入的 mp-html 改造版：模板与生命周期里大量使用 uni-app 条件编译
        // （#ifdef / #ifndef），eslint 不做预处理，会把不同平台的分支判成「重复 / 不可达」，
        // 也会把 #ifdef VUE2 里的 beforeDestroy 当成 Vue 3 的废弃写法。
        files: ['**/components/snake-rich-text/**/*.vue'],
        rules: {
            'vue/no-dupe-v-else-if': 'off',
            'vue/no-deprecated-destroyed-lifecycle': 'off',
            'vue/no-v-text-v-html-on-component': 'off'
        }
    },
    prettier
);
