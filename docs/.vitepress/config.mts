import { defineConfig } from 'vitepress';
import { cmsBlockGroups, cmsBlockItems } from './cms-block-groups';
import { componentGroups, componentItems } from './component-groups';
import { documentedToolItems, toolGroups } from './tool-groups';

const guideDescriptions: Record<string, string> = {
    '/guide/getting-started': '用 5 分钟在 uni-app Vue 3 项目中安装、配置并运行第一个 Snake UI 组件。',
    '/guide/intro': '了解 Snake UI 的定位、核心能力、适用场景和使用边界。',
    '/guide/compatibility': '查看 Snake UI 的运行环境、平台兼容性、工具链要求和能力边界。',
    '/guide/troubleshooting': '按现象排查 Snake UI 安装、样式、组件解析、主题和 CMS 接入问题。',
    '/guide/foundation': '集中配置 Snake UI 主题、语言、HTTP、业务适配器和 CMS 服务。',
    '/guide/multi-theme': '注册、切换并持久化 Snake UI 多主题与暗黑模式。'
};

function resolvePageDescription(relativePath: string, title: string): string {
    const route = `/${relativePath.replace(/\.md$/, '').replace(/\/index$/, '')}`;
    const catalogItem =
        componentItems.find(item => item.link === route) ||
        cmsBlockItems.find(item => item.link === route) ||
        documentedToolItems.find(item => item.link === route);

    if (catalogItem) return catalogItem.description;
    if (guideDescriptions[route]) return guideDescriptions[route];
    if (route.startsWith('/cms/')) return `${title}：Snake CMS 页面装修能力、数据协议与接入说明。`;
    if (route.startsWith('/components/')) return `${title}：Snake UI 组件的使用方式、平台边界和 API。`;
    if (route.startsWith('/tools/')) return `${title}：Snake UI 工具与组合式函数参考。`;
    return `${title}：Snake UI 面向 uni-app 商城与 CMS 场景的开发文档。`;
}

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
        ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
        ['meta', { name: 'theme-color', content: '#1b1d24', media: '(prefers-color-scheme: dark)' }],
        ['meta', { name: 'color-scheme', content: 'light dark' }]
    ],
    transformPageData(pageData) {
        if (pageData.frontmatter.description || pageData.frontmatter.search === false || pageData.isNotFound) return;
        return { description: resolvePageDescription(pageData.relativePath, pageData.title) };
    },
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
        editLink: {
            pattern: 'https://github.com/zwbcode/snake-ui/edit/main/docs/:path',
            text: '编辑此页'
        },
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
