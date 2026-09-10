export interface ToolItem {
    text: string;
    link: `/tools/${string}`;
    apis?: string[];
}

export interface ToolGroup {
    text: string;
    items: ToolItem[];
}

export const toolGroups: ToolGroup[] = [
    {
        text: '起步',
        items: [
            { text: '介绍', link: '/tools/intro' },
            { text: '快速使用', link: '/tools/fast-use' }
        ]
    },
    {
        text: '网络',
        items: [
            {
                text: 'HTTP 请求',
                link: '/tools/http',
                apis: ['Request', 'RequestError', 'http', 'configureHttp']
            }
        ]
    },
    {
        text: '工具库',
        items: [
            { text: '节流与防抖', link: '/tools/debounce-throttle', apis: ['debounce', 'throttle'] },
            { text: '对象深拷贝', link: '/tools/deep-clone', apis: ['deepClone'] },
            { text: '对象深合并', link: '/tools/deep-merge', apis: ['deepMerge'] },
            { text: '时间格式化', link: '/tools/time', apis: ['formatTime', 'timeFormat', 'timeFrom'] },
            { text: '路由跳转', link: '/tools/route', apis: ['route', 'navTo'] },
            { text: '数组乱序', link: '/tools/random-array', apis: ['randomArray'] },
            { text: '全局唯一标识符', link: '/tools/guid', apis: ['guid'] },
            {
                text: '颜色处理',
                link: '/tools/color',
                apis: ['hexToRgb', 'rgbToHex', 'colorToRgba', 'colorGradient']
            },
            { text: '对象转 URL 参数', link: '/tools/query-params', apis: ['getQueryParams', 'queryParams'] },
            { text: '规则校验', link: '/tools/test', apis: ['test'] },
            { text: '随机数值', link: '/tools/random', apis: ['random'] },
            { text: '去除空格', link: '/tools/trim', apis: ['trim'] },
            { text: '节点布局信息', link: '/tools/get-rect', apis: ['getRect'] },
            { text: '样式与单位', link: '/tools/style-unit', apis: ['addUnit', 'kebabCase', 'addStyle', 'toStyle'] },
            { text: '内容格式化', link: '/tools/formatters', apis: ['formatPrice', 'formatName'] },
            {
                text: '平台辅助',
                link: '/tools/platform',
                apis: ['clipboard', 'sys', 'os', 'sleep', 'toast', 'type2icon', 'getSystemInfo']
            },
            { text: '事件总线', link: '/tools/emitter', apis: ['createEmitter', 'emitter'] }
        ]
    },
    {
        text: '组合式函数',
        items: [
            { text: '主题管理', link: '/tools/use-theme', apis: ['useTheme'] },
            { text: '颜色管理', link: '/tools/use-color', apis: ['useColor'] },
            { text: '语言管理', link: '/tools/use-locale', apis: ['useLocale'] },
            { text: '路由', link: '/tools/use-router', apis: ['useRouter'] },
            { text: '节点信息', link: '/tools/use-rect', apis: ['useRect'] },
            { text: '轻提示', link: '/tools/use-toast', apis: ['useToast'] },
            { text: '模态框', link: '/tools/use-modal', apis: ['useModal'] },
            {
                text: '节流与防抖',
                link: '/tools/use-rate-limit',
                apis: ['useDebounce', 'useThrottle']
            },
            { text: '事件总线', link: '/tools/use-emitter', apis: ['useEmitter'] },
            { text: '组件关系', link: '/tools/use-comp-relation', apis: ['useParent', 'useChildren'] }
        ]
    }
];

export const documentedToolApis = toolGroups.flatMap(group => group.items.flatMap(item => item.apis || []));
