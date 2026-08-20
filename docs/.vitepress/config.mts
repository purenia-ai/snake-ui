import { defineConfig } from 'vitepress';
import { componentGroups } from './component-groups';

const componentSidebar = [
    { text: '组件总览', link: '/components/intro' },
    ...componentGroups.map(group => ({
        text: group.title,
        items: group.items.map(item => ({
            text: `${item.name} ${item.title}`,
            link: item.link
        }))
    }))
];

export default defineConfig({
    lang: 'zh-CN',
    title: 'Snake UI',
    description: '面向 uni-app 商城场景的 CMS 组件文档',
    cleanUrls: true,
    lastUpdated: true,
    srcExclude: ['superpowers/**'],
    vite: {
        server: {
            host: '0.0.0.0',
            port: 5174,
            strictPort: true
        }
    },
    head: [
        ['meta', { name: 'theme-color', content: '#00805a' }],
        ['meta', { name: 'color-scheme', content: 'light dark' }]
    ],
    themeConfig: {
        logo: {
            light: '/snake-mark-light.svg',
            dark: '/snake-mark-dark.svg',
            alt: 'Snake UI'
        },
        nav: [
            { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
            { text: '组件', link: '/components/intro', activeMatch: '/components/' }
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '开始',
                    items: [
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '全局配置与底座', link: '/guide/foundation' },
                        { text: '运行环境', link: '/guide/compatibility' },
                        { text: '组件数据约定', link: '/guide/component-data' },
                        { text: '装修编辑器数据对接', link: '/guide/sanke-editor' }
                    ]
                },
                {
                    text: '自定义',
                    items: [
                        { text: '多主题与暗黑模式', link: '/guide/multi-theme' },
                        { text: '主题生成器', link: '/guide/theme-generate' }
                    ]
                }
            ],
            '/components/': componentSidebar
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
