export interface ComponentItem {
    name: string;
    title: string;
    link: `/components/${string}`;
    description: string;
    keywords: string[];
    source: string;
    since?: string;
}

type ComponentDefinition = Omit<ComponentItem, 'description' | 'keywords' | 'source'> & {
    description?: string;
    keywords?: string[];
    source?: string;
};

export interface ComponentGroup {
    title: string;
    items: ComponentItem[];
}

interface ComponentGroupDefinition {
    title: string;
    items: ComponentDefinition[];
}

const componentDescriptions: Partial<Record<ComponentItem['link'], string>> = {
    '/components/button': '触发提交、确认和页面操作，覆盖加载、禁用与开放能力。',
    '/components/form': '组织表单字段、校验规则和错误提示，支持嵌套数据。',
    '/components/input': '采集文本、数字和密码，支持格式化与表单校验联动。',
    '/components/upload': '选择、预览并上传图片、视频或文件，支持自定义上传。',
    '/components/popup': '承载对话、选择器和底部面板，处理遮罩、滚动与安全区。',
    '/components/tabbar': '构建应用一级底部导航，支持原生 tabBar 替换和安全区。',
    '/components/search': '提供带清空、取消和操作区的搜索输入体验。',
    '/components/calendar': '选择单日、日期范围或多日期并处理可选边界。',
    '/components/icon': '使用内置图标字库或自定义图标前缀展示语义图标。',
    '/components/image': '加载、裁剪和预览图片，并提供加载失败兜底。',
    '/components/qr-code': '把文本或链接渲染为可扫描的二维码，支持中心 Logo 与导出图片。',
    '/components/tooltip': '在目标元素附近展示轻量提示内容和操作说明。'
};

const componentKeywords: Partial<Record<ComponentItem['link'], string[]>> = {
    '/components/popup': ['弹窗', '抽屉', '底部面板', 'dialog', 'sheet'],
    '/components/upload': ['文件', '图片上传', '视频上传', 'OSS', '选择文件'],
    '/components/tabbar': ['底部导航', '原生 tabBar', '一级导航'],
    '/components/no-network': ['断网', '离线', '重试'],
    '/components/notice-bar': ['公告', '滚动通知', '消息条'],
    '/components/drop-menu': ['筛选', '下拉筛选', '菜单'],
    '/components/config-provider': ['主题', '全局配置', '暗黑模式']
};

function enrichComponent(item: ComponentDefinition): ComponentItem {
    const slug = item.link.slice('/components/'.length);
    const sourceSlug = slug === 'cell' ? 'cell-group' : slug;
    return {
        ...item,
        description: item.description || componentDescriptions[item.link] || `在 uni-app 中实现${item.title}能力。`,
        keywords: Array.from(
            new Set([item.name, item.title, slug, ...(item.keywords || componentKeywords[item.link] || [])])
        ),
        source: item.source || `src/uni_modules/snake-ui/components/snake-${sourceSlug}/snake-${sourceSlug}.vue`
    };
}

const componentGroupDefinitions: ComponentGroupDefinition[] = [
    {
        title: '基础组件',
        items: [
            { name: 'Parse', title: '富文本解析', link: '/components/parse' },
            { name: 'ConfigProvider', title: '全局配置', link: '/components/config-provider' },
            { name: 'Button', title: '按钮', link: '/components/button' },
            { name: 'Icon', title: '图标', link: '/components/icon' },
            { name: 'Image', title: '图片', link: '/components/image' },
            { name: 'QrCode', title: '二维码', link: '/components/qr-code' },
            { name: 'Loading', title: '加载', link: '/components/loading' },
            { name: 'Skeleton', title: '骨架屏', link: '/components/skeleton' },
            { name: 'Transition', title: '过渡动画', link: '/components/transition' },
            { name: 'RootPortal', title: '根节点传送', link: '/components/root-portal' },
            { name: 'Text', title: '文本', link: '/components/text' },
            { name: 'Link', title: '超链接', link: '/components/link' }
        ]
    },
    {
        title: '表单组件',
        items: [
            { name: 'Form', title: '表单', link: '/components/form' },
            { name: 'Input', title: '输入框', link: '/components/input' },
            { name: 'Textarea', title: '文本域', link: '/components/textarea' },
            { name: 'Checkbox', title: '复选框', link: '/components/checkbox' },
            { name: 'Radio', title: '单选框', link: '/components/radio' },
            { name: 'Switch', title: '开关', link: '/components/switch' },
            { name: 'Slider', title: '滑动选择器', link: '/components/slider' },
            { name: 'Search', title: '搜索框', link: '/components/search' },
            { name: 'Select', title: '列选择器', link: '/components/select' },
            { name: 'Upload', title: '文件上传', link: '/components/upload' },
            { name: 'Calendar', title: '日历', link: '/components/calendar' }
        ]
    },
    {
        title: '数据组件',
        items: [
            { name: 'Loadmore', title: '加载更多', link: '/components/loadmore' },
            { name: 'LineProgress', title: '线形进度条', link: '/components/line-progress' },
            { name: 'ReadMore', title: '阅读更多', link: '/components/read-more' },
            { name: 'Empty', title: '空状态', link: '/components/empty' },
            { name: 'CountDown', title: '倒计时', link: '/components/count-down' }
        ]
    },
    {
        title: '反馈组件',
        items: [
            { name: 'NoticeBar', title: '通知栏', link: '/components/notice-bar' },
            { name: 'Overlay', title: '遮罩层', link: '/components/overlay' },
            { name: 'Tooltip', title: '文字提示', link: '/components/tooltip' },
            { name: 'Popup', title: '弹出层', link: '/components/popup' },
            { name: 'NoNetwork', title: '无网络提示', link: '/components/no-network' }
        ]
    },
    {
        title: '布局组件',
        items: [
            { name: 'Swiper', title: '轮播图', link: '/components/swiper' },
            { name: 'Sticky', title: '吸顶', link: '/components/sticky' },
            { name: 'Line', title: '分隔线', link: '/components/line' },
            { name: 'Cell', title: '单元格', link: '/components/cell' }
        ]
    },
    {
        title: '导航组件',
        items: [
            { name: 'Navbar', title: '导航栏', link: '/components/navbar' },
            { name: 'Tabbar', title: '底部导航栏', link: '/components/tabbar' },
            { name: 'Tabs', title: '标签页', link: '/components/tabs' },
            { name: 'Subsection', title: '分段器', link: '/components/subsection' },
            { name: 'ButtonSort', title: '排序按钮', link: '/components/button-sort' },
            { name: 'DropMenu', title: '下拉菜单', link: '/components/drop-menu' },
            { name: 'IndexList', title: '索引列表', link: '/components/index-list' },
            { name: 'IndexListPanel', title: '容器索引列表', link: '/components/index-list-panel' },
            { name: 'IndexAnchor', title: '索引锚点', link: '/components/index-anchor' }
        ]
    }
];

export const componentGroups: ComponentGroup[] = componentGroupDefinitions.map(group => ({
    ...group,
    items: group.items.map(enrichComponent)
}));

export const componentCount = componentGroups.reduce((total, group) => total + group.items.length, 0);
export const componentItems = componentGroups.flatMap(group =>
    group.items.map(item => ({ ...item, group: group.title, since: item.since || '0.1.0' }))
);
