import { defineConfig } from 'vitepress';
import { componentGroups } from './component-groups';
import { toolGroups } from './tool-groups';

const componentSidebar = [
    {
        text: '起步',
        items: [
            { text: '组件总览', link: '/components/intro' },
            { text: '安装', link: '/components/install' },
            { text: '配置', link: '/components/setting' },
            { text: '快速上手', link: '/components/quickstart' },
            { text: '内置样式', link: '/components/common' },
            { text: '组件使用注意事项', link: '/components/note' }
        ]
    },
    ...componentGroups.map(group => ({
        text: group.title,
        items: group.items.map(item => ({
            text: `${item.name} ${item.title}`,
            link: item.link
        }))
    }))
];

const cmsSidebar = [
    {
        text: '开始',
        items: [{ text: 'CMS 快速接入', link: '/cms/getting-started' }]
    },
    {
        text: '数据与编辑器',
        items: [
            { text: '组件数据约定', link: '/cms/component-data' },
            { text: '装修编辑器数据对接', link: '/cms/sanke-editor' }
        ]
    },
    {
        text: '组件参考',
        items: [{ text: 'CMS 组件总览', link: '/cms/components' }]
    }
];

export default defineConfig({
    base: '/snake-ui/',
    lang: 'zh-CN',
    title: 'Snake UI',
    description: '面向 uni-app 商城与 CMS 场景的 Vue 3 组件库',
    cleanUrls: true,
    lastUpdated: true,
    srcExclude: ['superpowers/**'],
    vite: {
        server: {
            host: '0.0.0.0',
            port: 5174,
            strictPort: true,
            fs: {
                allow: ['..']
            }
        }
    },
    head: [
        ['meta', { name: 'theme-color', content: '#06D290' }],
        ['meta', { name: 'color-scheme', content: 'light dark' }]
    ],
    themeConfig: {
        logo: {
            light: '/snake-mark-light.svg',
            dark: '/snake-mark-dark.svg',
            alt: 'Snake UI'
        },
        nav: [
            { text: '指南', link: '/guide/intro', activeMatch: '^/guide/' },
            { text: '组件', link: '/components/intro', activeMatch: '/components/' },
            { text: 'CMS', link: '/cms/getting-started', activeMatch: '/cms/' },
            { text: '工具', link: '/tools/intro', activeMatch: '/tools/' }
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '开始',
                    items: [
                        { text: '介绍', link: '/guide/intro' },
                        { text: '运行环境与能力边界', link: '/guide/compatibility' },
                        { text: '设计理念', link: '/guide/design-principles' }
                    ]
                },
                {
                    text: '配置与自定义',
                    items: [
                        { text: '全局配置总览', link: '/guide/foundation' },
                        { text: '国际化', link: '/guide/internationalization' },
                        { text: '多主题与暗黑模式', link: '/guide/multi-theme' },
                        { text: '主题生成器', link: '/guide/theme-generate' },
                        { text: '自定义样式', link: '/guide/custom-style' }
                    ]
                },
                {
                    text: '迁移与排错',
                    items: [
                        { text: '从 uView Pro 迁移', link: '/guide/migrate-from-uview' },
                        { text: 'libs 层对齐审计', link: '/guide/libs-audit' },
                        { text: '常见问题', link: '/guide/troubleshooting' }
                    ]
                }
            ],
            '/cms/': cmsSidebar,
            '/components/': componentSidebar,
            '/tools/': toolGroups
        },
        outline: { level: [2, 3], label: '本页内容' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
                    modal: {
                        noResultsText: '没有找到相关结果',
                        resetButtonTitle: '清除查询条件',
                        footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
                    }
                }
            }
        },
        footer: {
            message: '为 uni-app 商城与 CMS 场景设计',
            copyright: 'Snake UI component reference'
        }
    }
});
