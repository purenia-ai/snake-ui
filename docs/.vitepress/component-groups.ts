export interface ComponentItem {
    name: string;
    title: string;
    link: `/components/${string}`;
    since?: string;
}

export interface ComponentGroup {
    title: string;
    items: ComponentItem[];
}

export const componentGroups: ComponentGroup[] = [
    {
        title: '基础组件',
        items: [
            { name: 'ConfigProvider', title: '全局配置', link: '/components/config-provider' },
            { name: 'Button', title: '按钮', link: '/components/button' },
            { name: 'Icon', title: '图标', link: '/components/icon' },
            { name: 'Image', title: '图片', link: '/components/image' },
            { name: 'LazyImage', title: '懒加载图片', link: '/components/lazy-image' },
            { name: 'LoadingIcon', title: '加载图标', link: '/components/loading-icon' },
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

export const componentCount = componentGroups.reduce((total, group) => total + group.items.length, 0);
export const componentItems = componentGroups.flatMap(group =>
    group.items.map(item => ({ ...item, group: group.title, since: item.since || '0.1.0' }))
);
