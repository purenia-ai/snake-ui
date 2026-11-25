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
    '/components/verification-code': '维护验证码倒计时状态与文案，支持跨页面续跑，界面由宿主自由组合。',
    '/components/upload': '选择、预览并上传图片、视频或文件，支持自定义上传。',
    '/components/popup': '承载对话、选择器和底部面板，处理遮罩、滚动与安全区。',
    '/components/tabbar': '构建应用一级底部导航，支持原生 tabBar 替换和安全区。',
    '/components/search': '提供带清空、取消和操作区的搜索输入体验。',
    '/components/calendar': '选择单日、日期范围或多日期并处理可选边界。',
    '/components/icon': '使用内置图标字库或自定义图标前缀展示语义图标。',
    '/components/image': '加载、裁剪和预览图片，并提供加载失败兜底。',
    '/components/image-cropper': '选图后按比例裁剪，支持拖动、双指缩放与 90° 旋转，导出临时文件。',
    '/components/avatar': '展示用户或品牌头像，图片失败降级为文字或图标，也可叠成头像组并折叠为 +N。',
    '/components/skeleton': '在首次加载时用结构占位替代内容，避免列表与详情页闪白。',
    '/components/rich-text': '渲染后台编辑的 HTML 正文，补齐图片预览、链接、表格与音视频交互。',
    '/components/qr-code': '把文本或链接渲染为可扫描的二维码，支持中心 Logo 与导出图片。',
    '/components/tooltip': '在目标元素附近展示轻量提示内容和操作说明。',
    '/components/tag': '以短文本标记商品属性、状态与筛选结果，支持主题、镂空与关闭。',
    '/components/action-sheet': '从底部弹出动作列表，承载客服、分享与更多操作。',
    '/components/steps': '按流程顺序展示进度，用于订单状态、售后处理与物流轨迹。',
    '/components/collapse': '把长内容折叠成标题行，用于商品参数、FAQ 与售后说明。',
    '/components/grid': '把入口按等分宽度排成九宫格，用于首页金刚区与快捷入口。',
    '/components/swipe-action': '列表项左滑露出操作按钮，用于删除、收藏与取消订单。',
    '/components/backtop': '长页面滚动后提供一键回顶入口，隐藏时不占位。',
    '/components/picker': '在底部弹层里滚动选择单列、多列或联动列，适合日期与地区。',
    '/components/keyboard': '用底部虚拟键盘输入数字、金额与身份证号，支持随机顺序与长按删除。',
    '/components/select-picker': '在底部弹层内以列表勾选，支持单选、多选、本地搜索与选择数量限制。'
};

const componentKeywords: Partial<Record<ComponentItem['link'], string[]>> = {
    '/components/skeleton': ['骨架屏', '占位', '加载中', '首屏', 'shimmer', 'pulse'],
    '/components/rich-text': ['富文本', 'HTML', '正文', '文章详情', 'mp-html', 'parse'],
    '/components/popup': ['弹窗', '抽屉', '底部面板', 'dialog', 'sheet'],
    '/components/upload': ['文件', '图片上传', '视频上传', 'OSS', '选择文件'],
    '/components/tabbar': ['底部导航', '原生 tabBar', '一级导航'],
    '/components/no-network': ['断网', '离线', '重试'],
    '/components/notice-bar': ['公告', '滚动通知', '消息条'],
    '/components/drop-menu': ['筛选', '下拉筛选', '菜单'],
    '/components/config-provider': ['主题', '全局配置', '暗黑模式'],
    '/components/select-picker': ['多选', '单选', '列表选择', '复选列表', '带搜索的选择器'],
    '/components/keyboard': ['数字键盘', '金额输入', '身份证', '验证码', '密码', 'number pad'],
    '/components/image-cropper': ['图片裁剪', '头像裁剪', '裁剪比例', '旋转', 'crop'],
    '/components/avatar': ['用户头像', '头像组', '首字母兜底', '参与人', 'avatar group']
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
            { name: 'RichText', title: '富文本', link: '/components/rich-text' },
            { name: 'ConfigProvider', title: '全局配置', link: '/components/config-provider' },
            { name: 'Button', title: '按钮', link: '/components/button' },
            { name: 'Tag', title: '标签', link: '/components/tag' },
            { name: 'Icon', title: '图标', link: '/components/icon' },
            { name: 'Badge', title: '徽标', link: '/components/badge' },
            { name: 'Image', title: '图片', link: '/components/image' },
            { name: 'ImageCropper', title: '图片裁剪', link: '/components/image-cropper' },
            { name: 'Avatar', title: '头像', link: '/components/avatar' },
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
            { name: 'Picker', title: '列选择器', link: '/components/picker' },
            { name: 'Keyboard', title: '虚拟键盘', link: '/components/keyboard' },
            { name: 'SelectPicker', title: '单复选选择器', link: '/components/select-picker' },
            { name: 'Upload', title: '文件上传', link: '/components/upload' },
            { name: 'VerificationCode', title: '验证码倒计时', link: '/components/verification-code' },
            { name: 'Calendar', title: '日历', link: '/components/calendar' }
        ]
    },
    {
        title: '数据组件',
        items: [
            { name: 'Loadmore', title: '加载更多', link: '/components/loadmore' },
            { name: 'LineProgress', title: '线形进度条', link: '/components/line-progress' },
            { name: 'CircleProgress', title: '环形进度条', link: '/components/circle-progress' },
            { name: 'ReadMore', title: '阅读更多', link: '/components/read-more' },
            { name: 'Empty', title: '空状态', link: '/components/empty' },
            { name: 'CountDown', title: '倒计时', link: '/components/count-down' },
            { name: 'Steps', title: '步骤条', link: '/components/steps' },
            { name: 'Collapse', title: '折叠面板', link: '/components/collapse' }
        ]
    },
    {
        title: '反馈组件',
        items: [
            { name: 'NoticeBar', title: '通知栏', link: '/components/notice-bar' },
            { name: 'Overlay', title: '遮罩层', link: '/components/overlay' },
            { name: 'Tooltip', title: '文字提示', link: '/components/tooltip' },
            { name: 'Popup', title: '弹出层', link: '/components/popup' },
            { name: 'ActionSheet', title: '动作面板', link: '/components/action-sheet' },
            { name: 'NoNetwork', title: '无网络提示', link: '/components/no-network' }
        ]
    },
    {
        title: '布局组件',
        items: [
            { name: 'Swiper', title: '轮播图', link: '/components/swiper' },
            { name: 'Sticky', title: '吸顶', link: '/components/sticky' },
            { name: 'Backtop', title: '回到顶部', link: '/components/backtop' },
            { name: 'Line', title: '分隔线', link: '/components/line' },
            { name: 'Cell', title: '单元格', link: '/components/cell' },
            { name: 'Grid', title: '宫格', link: '/components/grid' },
            { name: 'SwipeAction', title: '滑动操作', link: '/components/swipe-action' }
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
