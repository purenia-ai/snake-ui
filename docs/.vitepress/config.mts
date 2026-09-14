import { defineConfig } from 'vitepress';
import { cmsBlockGroups } from './cms-block-groups';
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
            { text: '组件使用注意事项', link: '/components/note' },
            { text: '更新日志', link: '/components/changelog' }
        ]
    },
    ...componentGroups.map(group => ({
        text: group.title,
        collapsed: false,
        items: [
            ...(group.title === '基础组件' ? [{ text: 'Color 色彩', link: '/components/color' }] : []),
            ...group.items.map(item => ({
                text: `${item.name} ${item.title}`,
                link: item.link
            }))
        ]
    }))
];

const cmsSidebar = [
    {
        text: '开始',
        items: [
            { text: 'CMS 快速接入', link: '/cms/getting-started' },
            { text: 'CMS 组件总览', link: '/cms/overview' }
        ]
    },
    {
        text: '数据与服务',
        items: [
            { text: '页面数据协议', link: '/cms/data-contract' },
            { text: '业务服务接入', link: '/cms/services' },
            { text: '装修编辑器数据对接', link: '/cms/sanke-editor' }
        ]
    },
    ...cmsBlockGroups.map(group => ({
        text: group.title,
        items: group.items.map(item => ({ text: `${item.name} ${item.title}`, link: item.link }))
    }))
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
            {
                text: '指南',
                activeMatch: '^/guide/',
                items: [
                    {
                        text: '开始',
                        items: [
                            { text: '快速开始', link: '/guide/getting-started' },
                            { text: '介绍', link: '/guide/intro' },
                            { text: '运行环境', link: '/guide/compatibility' },
                            { text: '常见问题', link: '/guide/troubleshooting' }
                        ]
                    },
                    {
                        text: '配置与自定义',
                        items: [
                            { text: '全局配置', link: '/guide/foundation' },
                            { text: '主题与暗黑模式', link: '/guide/multi-theme' }
                        ]
                    },
                    {
                        text: 'AI',
                        items: [
                            { text: '概述', link: '/guide/ai' },
                            { text: 'Skills', link: '/guide/skills' },
                            { text: 'LLM 上下文', link: '/guide/llms' }
                        ]
                    }
                ]
            },
            {
                text: '组件',
                activeMatch: '^/components/',
                items: [
                    {
                        text: '起步',
                        items: [
                            { text: '组件总览', link: '/components/intro' },
                            { text: '安装', link: '/components/install' },
                            { text: '快速上手', link: '/components/quickstart' }
                        ]
                    },
                    {
                        text: '常用组件',
                        items: [
                            { text: '基础组件', link: '/components/button' },
                            { text: '表单组件', link: '/components/form' },
                            { text: '导航组件', link: '/components/tabbar' }
                        ]
                    }
                ]
            },
            {
                text: 'CMS',
                activeMatch: '^/cms/',
                items: [
                    {
                        text: '开始',
                        items: [
                            { text: '快速接入', link: '/cms/getting-started' },
                            { text: '组件总览', link: '/cms/overview' }
                        ]
                    },
                    {
                        text: '数据与服务',
                        items: [
                            { text: '页面数据协议', link: '/cms/data-contract' },
                            { text: '业务服务接入', link: '/cms/services' },
                            { text: '装修编辑器', link: '/cms/sanke-editor' }
                        ]
                    }
                ]
            },
            {
                text: '工具',
                activeMatch: '^/tools/',
                items: [
                    {
                        text: '起步',
                        items: [
                            { text: '工具总览', link: '/tools/intro' },
                            { text: '快速使用', link: '/tools/fast-use' }
                        ]
                    },
                    {
                        text: '常用能力',
                        items: [
                            { text: 'HTTP 请求', link: '/tools/http' },
                            { text: '工具函数', link: '/tools/deep-merge' },
                            { text: '组合式函数', link: '/tools/use-theme' }
                        ]
                    }
                ]
            }
        ],
        socialLinks: [{ icon: 'github', link: 'https://github.com/zwbcode/snake-ui' }],
        sidebar: {
            '/guide/': [
                {
                    text: '开始',
                    items: [
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '介绍', link: '/guide/intro' },
                        { text: '运行环境与能力边界', link: '/guide/compatibility' },
                        { text: '代码提示', link: '/guide/code-hint' },
                        { text: '常见问题', link: '/guide/troubleshooting' },
                        { text: '设计理念', link: '/guide/design-principles' }
                    ]
                },
                {
                    text: '配置与自定义',
                    items: [
                        { text: '全局配置总览', link: '/guide/foundation' },
                        { text: '国际化', link: '/guide/internationalization' },
                        { text: '虚拟根组件', link: '/guide/root' },
                        { text: '扩展图标库', link: '/guide/custom-icon' },
                        { text: '多主题与暗黑模式', link: '/guide/multi-theme' },
                        { text: '主题生成器', link: '/guide/theme-generate' },
                        { text: '自定义样式', link: '/guide/custom-style' }
                    ]
                },
                {
                    text: 'AI',
                    items: [
                        { text: '概述', link: '/guide/ai' },
                        { text: 'Skills', link: '/guide/skills' },
                        { text: 'LLM 上下文', link: '/guide/llms' }
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
