export interface ToolItem {
    icon: string;
    title: string;
    desc: string;
    url: string;
    category: string;
    categoryEn: string;
}

const tools: ToolItem[] = [
    {
        icon: 'file-text',
        title: 'HTTP 请求',
        desc: '配置、传输层与错误模型',
        url: '/pages/library/http/index',
        category: '网络',
        categoryEn: 'Network'
    },
    {
        icon: 'clock',
        title: '节流与防抖',
        desc: '控制高频交互的触发节奏',
        url: '/pages/library/debounceThrottle/index',
        category: '运行时',
        categoryEn: 'Runtime'
    },
    {
        icon: 'arrow-right',
        title: '路由跳转',
        desc: 'Promise 化的 uni-app 导航',
        url: '/pages/library/route/index',
        category: '运行时',
        categoryEn: 'Runtime'
    },
    {
        icon: 'setting',
        title: '主题与语言',
        desc: '响应式 Hooks 实时切换',
        url: '/pages/other/themeLocale/index',
        category: '基础能力',
        categoryEn: 'Foundation'
    }
];

export default tools;
