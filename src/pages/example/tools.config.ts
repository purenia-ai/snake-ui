export interface SnakeToolItem {
    icon: string;
    title: string;
    desc: string;
    url: string;
}

const tools: SnakeToolItem[] = [
    { icon: 'page', title: 'HTTP 请求', desc: '配置、传输层与错误模型', url: '/pages/library/http/index' },
    {
        icon: 'clock',
        title: '节流与防抖',
        desc: '控制高频交互的触发节奏',
        url: '/pages/library/debounceThrottle/index'
    },
    {
        icon: 'arrow-right',
        title: '路由跳转',
        desc: 'Promise 化的 uni-app 导航',
        url: '/pages/library/route/index'
    },
    {
        icon: 'setting',
        title: '主题与语言',
        desc: '响应式 Hooks 实时切换',
        url: '/pages/other/themeLocale/index'
    }
];

export default tools;
