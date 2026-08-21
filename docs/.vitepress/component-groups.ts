export interface ComponentItem {
    name: string;
    title: string;
    link: `/components/${string}`;
    cms?: boolean;
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
            { name: 'Transition', title: '过渡动画', link: '/components/transition' }
        ]
    },
    {
        title: '数据展示',
        items: [
            { name: 'Swiper', title: '轮播图', link: '/components/swiper' },
            { name: 'Loadmore', title: '加载更多', link: '/components/loadmore' },
            { name: 'Empty', title: '空状态', link: '/components/empty' }
        ]
    },
    {
        title: '反馈组件',
        items: [
            { name: 'NoticeBar', title: '通知栏', link: '/components/notice-bar' },
            { name: 'Overlay', title: '遮罩层', link: '/components/overlay' },
            { name: 'Popup', title: '弹出层', link: '/components/popup' }
        ]
    },
    {
        title: '布局与导航',
        items: [
            { name: 'Sticky', title: '吸顶', link: '/components/sticky' },
            { name: 'Tabs', title: '标签页', link: '/components/tabs' },
            { name: 'ButtonSort', title: '排序按钮', link: '/components/button-sort' },
            { name: 'DropMenu', title: '下拉菜单', link: '/components/drop-menu' },
            { name: 'DropMenuItem', title: '下拉菜单项', link: '/components/drop-menu-item' },
            { name: 'IndexList', title: '索引列表', link: '/components/index-list' },
            { name: 'IndexAnchor', title: '索引锚点', link: '/components/index-anchor' }
        ]
    },
    {
        title: '表单组件',
        items: [
            { name: 'Form', title: '表单', link: '/components/form' },
            { name: 'FormItem', title: '表单项', link: '/components/form-item' },
            { name: 'Input', title: '输入框', link: '/components/input' },
            { name: 'Textarea', title: '文本域', link: '/components/textarea' },
            { name: 'Checkbox', title: '复选框', link: '/components/checkbox' },
            { name: 'CheckboxGroup', title: '复选框组', link: '/components/checkbox-group' },
            { name: 'Radio', title: '单选框', link: '/components/radio' },
            { name: 'RadioGroup', title: '单选框组', link: '/components/radio-group' },
            { name: 'Switch', title: '开关', link: '/components/switch' },
            { name: 'Slider', title: '滑动选择器', link: '/components/slider' }
        ]
    },
    {
        title: 'CMS 容器',
        items: [
            { name: 'SnakeCms', title: 'CMS 页面容器', link: '/components/snake-cms', cms: true },
            { name: 'CustomModule', title: '自定义模块', link: '/components/custom-module', cms: true }
        ]
    },
    {
        title: 'CMS 内容',
        items: [
            { name: 'Images', title: '图片展示', link: '/components/images', cms: true },
            { name: 'Hotzone', title: '热区图', link: '/components/hotzone', cms: true },
            { name: 'PictureAds', title: '轮播广告', link: '/components/picture-ads', cms: true },
            { name: 'MagicCube', title: '魔方布局', link: '/components/magic-cube', cms: true },
            { name: 'Videos', title: '视频', link: '/components/videos', cms: true },
            { name: 'RichText', title: '富文本', link: '/components/rich-text', cms: true },
            { name: 'Notice', title: '公告', link: '/components/notice', cms: true },
            {
                name: 'AuxiliarySegmentation',
                title: '辅助分割线',
                link: '/components/auxiliary-segmentation',
                cms: true
            }
        ]
    },
    {
        title: 'CMS 导航互动',
        items: [
            { name: 'GraphicNavigation', title: '图文导航', link: '/components/graphic-navigation', cms: true },
            { name: 'CommoditySearch', title: '商品搜索', link: '/components/commodity-search', cms: true },
            { name: 'Suspension', title: '悬浮入口', link: '/components/suspension', cms: true },
            { name: 'PagePopup', title: '页面弹窗', link: '/components/page-popup', cms: true },
            { name: 'JumpApplet', title: '小程序跳转', link: '/components/jump-applet', cms: true },
            { name: 'Follow', title: '关注', link: '/components/follow', cms: true }
        ]
    },
    {
        title: 'CMS 商品',
        items: [
            { name: 'GoodsList', title: '商品列表', link: '/components/goods-list', cms: true },
            { name: 'ActivityList', title: '活动列表', link: '/components/activity-list', cms: true },
            { name: 'FilterSorts', title: '筛选排序', link: '/components/filter-sorts', cms: true },
            { name: 'ListSwitching', title: '列表切换', link: '/components/list-switching', cms: true },
            { name: 'Coupon', title: '优惠券', link: '/components/coupon', cms: true }
        ]
    }
];

export const componentCount = componentGroups.reduce((total, group) => total + group.items.length, 0);
