import { defineConfig } from 'vitepress';

const componentGroups = [
    {
        text: '基础组件',
        items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Loading Icon 加载', link: '/components/loading-icon' },
            { text: 'Transition 动画', link: '/components/transition' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Lazy Image 懒加载', link: '/components/lazy-image' },
            { text: 'Swiper 轮播图', link: '/components/swiper' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Notice Bar 通知栏', link: '/components/notice-bar' },
            { text: 'Loadmore 加载更多', link: '/components/loadmore' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Overlay 遮罩层', link: '/components/overlay' },
            { text: 'Popup 弹出层', link: '/components/popup' },
            { text: 'Sticky 吸顶', link: '/components/sticky' },
            { text: 'Button Sort 排序按钮', link: '/components/button-sort' },
            { text: 'Drop Menu 下拉菜单', link: '/components/drop-menu' },
            { text: 'Drop Menu Item 菜单项', link: '/components/drop-menu-item' },
            { text: 'Index List 索引列表', link: '/components/index-list' },
            { text: 'Index Anchor 索引锚点', link: '/components/index-anchor' }
        ]
    },
    {
        text: '表单组件',
        items: [
            { text: 'Form 表单', link: '/components/form' },
            { text: 'Form Item 表单项', link: '/components/form-item' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Checkbox Group 复选框组', link: '/components/checkbox-group' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Radio Group 单选框组', link: '/components/radio-group' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Slider 滑动选择器', link: '/components/slider' }
        ]
    },
    {
        text: '容器',
        items: [
            { text: 'Snake CMS', link: '/components/snake-cms' },
            { text: '自定义模块', link: '/components/custom-module' }
        ]
    },
    {
        text: '内容展示',
        items: [
            { text: '图片展示', link: '/components/images' },
            { text: '热区图', link: '/components/hotzone' },
            { text: '轮播广告', link: '/components/picture-ads' },
            { text: '魔方布局', link: '/components/magic-cube' },
            { text: '视频', link: '/components/videos' },
            { text: '富文本', link: '/components/rich-text' },
            { text: '公告', link: '/components/notice' },
            { text: '辅助分割线', link: '/components/auxiliary-segmentation' }
        ]
    },
    {
        text: '导航与互动',
        items: [
            { text: '图文导航', link: '/components/graphic-navigation' },
            { text: '商品搜索', link: '/components/commodity-search' },
            { text: '悬浮入口', link: '/components/suspension' },
            { text: '页面弹窗', link: '/components/page-popup' },
            { text: '小程序跳转', link: '/components/jump-applet' },
            { text: '关注', link: '/components/follow' }
        ]
    },
    {
        text: '商品',
        items: [
            { text: '商品列表', link: '/components/goods-list' },
            { text: '活动列表', link: '/components/activity-list' },
            { text: '筛选排序', link: '/components/filter-sorts' },
            { text: '列表切换', link: '/components/list-switching' },
            { text: '优惠券', link: '/components/coupon' }
        ]
    }
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
            { text: '组件', link: '/components/snake-cms', activeMatch: '/components/' }
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
                }
            ],
            '/components/': componentGroups
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
