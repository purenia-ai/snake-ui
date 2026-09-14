// 分包目录负责路由组织；该配置只表达用户可理解的语义分类。
// 分组与文档站组件侧边栏（docs/.vitepress/component-groups.ts）保持一致。
export interface ComponentItem {
    path: string;
    title: string;
    titleEn: string;
    desc: string;
    cms?: boolean;
}

export interface ComponentGroup {
    groupName: string;
    groupNameEn: string;
    icon: string;
    list: ComponentItem[];
}

const item = (path: string, title: string, titleEn: string, desc: string, cms = false): ComponentItem => ({
    path,
    title,
    titleEn,
    desc,
    cms
});

const componentGroups: ComponentGroup[] = [
    {
        groupName: '基础组件',
        groupNameEn: 'Foundation',
        icon: '◈',
        list: [
            item('/pages/componentsA/button/index', 'Button 按钮', 'Button', '触发即时操作，支持主题、朴素、禁用和加载状态。'),
            item('/pages/componentsA/icon/index', 'Icon 图标', 'Icon', '常用图标集合，支持自定义尺寸与颜色。'),
            item('/pages/componentsA/image/index', 'Image 图片', 'Image', '图片展示，支持视口懒加载、占位、圆角与自适应模式。'),
            item('/pages/componentsA/loadingIcon/index', 'LoadingIcon 加载图标', 'LoadingIcon', '统一展示组件和页面中的加载状态。'),
            item('/pages/componentsA/skeleton/index', 'Skeleton 骨架屏', 'Skeleton', '在首次加载时预显示页面结构。'),
            item('/pages/componentsA/transition/index', 'Transition 过渡动画', 'Transition', '提供一致的跨端进出场动画。'),
            item(
                '/pages/componentsA/rootPortal/index',
                'RootPortal 根节点传送',
                'RootPortal',
                '把内容传送到页面根节点，解决复杂布局下 fixed 弹层失效的问题。'
            ),
            item('/pages/componentsA/text/index', 'Text 文本', 'Text', '价格、脱敏、日期与链接等常用文本场景。'),
            item('/pages/componentsA/link/index', 'Link 超链接', 'Link', '跨端打开链接或复制到粘贴板。')
        ]
    },
    {
        groupName: '表单组件',
        groupNameEn: 'Form',
        icon: '✓',
        list: [
            item('/pages/componentsA/form/index', 'Form 表单', 'Form', '统一管理字段、规则校验、重置和错误状态。'),
            item('/pages/componentsA/input/index', 'Input 输入框', 'Input', '单行输入，支持清空、密码和前后插槽。'),
            item('/pages/componentsA/textarea/index', 'Textarea 文本域', 'Textarea', '多行输入，支持自适应高度和字数统计。'),
            item('/pages/componentsA/checkbox/index', 'Checkbox 复选框', 'Checkbox', '独立或成组选择多个值。'),
            item('/pages/componentsA/radio/index', 'Radio 单选框', 'Radio', '独立或成组选择单个值。'),
            item('/pages/componentsA/switch/index', 'Switch 开关', 'Switch', '切换布尔值或自定义开关值。'),
            item('/pages/componentsA/slider/index', 'Slider 滑动选择器', 'Slider', '通过点击或触摸拖动选择数值。'),
            item('/pages/componentsA/search/index', 'Search 搜索框', 'Search', '集成占位、清除与操作按钮的常用搜索输入。'),
            item('/pages/componentsA/select/index', 'Select 列选择器', 'Select', '单列、多列与多列联动的底部选择器。'),
            item('/pages/componentsA/upload/index', 'Upload 文件上传', 'Upload', '上传图片、视频和文件，支持 OSS 适配器。'),
            item('/pages/componentsA/calendar/index', 'Calendar 日历', 'Calendar', '单个或范围日期选择，支持农历与节日。')
        ]
    },
    {
        groupName: '数据组件',
        groupNameEn: 'Data',
        icon: '▦',
        list: [
            item('/pages/componentsA/loadmore/index', 'Loadmore 加载更多', 'Loadmore', '反馈可加载、加载中和没有更多状态。'),
            item(
                '/pages/componentsA/lineProgress/index',
                'LineProgress 线形进度条',
                'LineProgress',
                '以线形进度展示任务完成情况，支持条纹与百分比。'
            ),
            item('/pages/componentsA/readMore/index', 'ReadMore 阅读更多', 'ReadMore', '长内容先收起一部分，点击展开全文。'),
            item('/pages/componentsA/empty/index', 'Empty 空状态', 'Empty', '空数据占位并提供清晰的下一步提示。'),
            item('/pages/componentsA/countDown/index', 'CountDown 倒计时', 'Count Down', '用于活动截止等场景的倒计时。')
        ]
    },
    {
        groupName: '反馈组件',
        groupNameEn: 'Feedback',
        icon: '◉',
        list: [
            item('/pages/componentsA/noticeBar/index', 'NoticeBar 通知栏', 'NoticeBar', '支持横向通知与纵向多条轮播。'),
            item('/pages/componentsA/overlay/index', 'Overlay 遮罩层', 'Overlay', '隔离当前页面与浮层操作。'),
            item('/pages/componentsA/popup/index', 'Popup 弹出层', 'Popup', '支持从不同方向出现并承载业务内容。'),
            item('/pages/componentsA/noNetwork/index', 'NoNetwork 无网络提示', 'NoNetwork', '自动监听网络状态，断网时全屏提示并支持重试。')
        ]
    },
    {
        groupName: '布局组件',
        groupNameEn: 'Layout',
        icon: '▤',
        list: [
            item('/pages/componentsA/swiper/index', 'Swiper 轮播图', 'Swiper', '支持自动播放、指示器与标题展示。'),
            item('/pages/componentsA/sticky/index', 'Sticky 吸顶', 'Sticky', '滚动时将重要内容固定在页面顶部。'),
            item('/pages/componentsA/line/index', 'Line 分隔线', 'Line', '以横向或竖向线条分隔内容块，支持半像素细线。'),
            item('/pages/componentsA/cell/index', 'Cell 单元格', 'Cell', '组合单元格条目与分组容器，用于设置和个人中心等列表场景。')
        ]
    },
    {
        groupName: '导航组件',
        groupNameEn: 'Navigation',
        icon: '⌘',
        list: [
            item('/pages/componentsA/navbar/index', 'Navbar 导航栏', 'Navbar', '用于页面顶部导航并处理返回与安全区。'),
            item('/pages/componentsA/tabs/index', 'Tabs 标签页', 'Tabs', '在同层级内容之间快速切换。'),
            item('/pages/componentsA/subsection/index', 'Subsection 分段选择器', 'Subsection', '在少量互斥选项之间快速切换。'),
            item('/pages/componentsA/buttonSort/index', 'ButtonSort 排序按钮', 'ButtonSort', '在升序、降序和默认状态之间循环切换。'),
            item('/pages/componentsA/dropMenu/index', 'DropMenu 下拉菜单', 'DropMenu', '协调多个下拉菜单项的展开与关闭。'),
            item('/pages/componentsA/indexList/index', 'IndexList 索引列表', 'IndexList', '通过右侧索引快速定位分组内容。'),
            item(
                '/pages/componentsA/indexListPanel/index',
                'IndexListPanel 容器索引列表',
                'IndexListPanel',
                '用于弹窗和定高区域的内部滚动索引列表。'
            ),
            item('/pages/componentsA/indexAnchor/index', 'IndexAnchor 索引锚点', 'IndexAnchor', '定义索引列表中的内容分组位置。')
        ]
    },
    {
        groupName: 'CMS 容器',
        groupNameEn: 'CMS Container',
        icon: '◧',
        list: [
            item('/pages/componentsB/snakeCms/index', 'Snake CMS 装修容器', 'Snake CMS', '按配置顺序渲染完整的 CMS 页面。', true),
            item('/pages/componentsB/customModule/index', 'CustomModule 自定义模块', 'CustomModule', '通过命名插槽接入业务自定义内容。', true)
        ]
    },
    {
        groupName: 'CMS 内容',
        groupNameEn: 'CMS Content',
        icon: 'C',
        list: [
            item('/pages/componentsB/images/index', 'Images 图片展示', 'Images', '按装修数据展示单图或多图内容。', true),
            item('/pages/componentsB/pictureAds/index', 'PictureAds 轮播广告', 'PictureAds', '焦点广告轮播，支持间距、圆角与间隔。', true),
            item('/pages/componentsB/magicCube/index', 'MagicCube 魔方布局', 'MagicCube', '可配置宫格组合营销图片和入口。', true),
            item('/pages/componentsB/videos/index', 'Videos 视频', 'Videos', '在装修页面中承载视频播放内容。', true),
            item('/pages/componentsB/richText/index', 'RichText 富文本', 'RichText', '渲染后台编辑的图文和格式化内容。', true),
            item('/pages/componentsB/notice/index', 'Notice 公告', 'Notice', '在装修页面中滚动展示业务公告。', true),
            item(
                '/pages/componentsB/auxiliarySegmentation/index',
                'AuxiliarySegmentation 辅助分割',
                'AuxiliarySegmentation',
                '在装修区块之间提供留白或分隔线。',
                true
            )
        ]
    },
    {
        groupName: 'CMS 导航互动',
        groupNameEn: 'CMS Interaction',
        icon: 'N',
        list: [
            item(
                '/pages/componentsB/graphicNavigation/index',
                'GraphicNavigation 图文导航',
                'GraphicNavigation',
                '图标与文字组合的快捷导航入口。',
                true
            ),
            item('/pages/componentsB/commoditySearch/index', 'CommoditySearch 商品搜索', 'CommoditySearch', '商城装修页面中的商品搜索入口。', true),
            item('/pages/componentsB/floatingBubble/index', 'FloatingBubble 悬浮气泡', 'FloatingBubble', '始终可见的营销或客服入口。', true),
            item('/pages/componentsB/pagePopup/index', 'PagePopup 页面弹窗', 'PagePopup', '根据业务场景展示营销弹窗。', true),
            item('/pages/componentsB/jumpApplet/index', 'JumpApplet 小程序跳转', 'JumpApplet', '通过按钮触发目标小程序跳转。', true),
            item('/pages/componentsB/follow/index', 'Follow 关注', 'Follow', '引导用户关注公众号或品牌账号。', true)
        ]
    },
    {
        groupName: 'CMS 商品',
        groupNameEn: 'CMS Commerce',
        icon: '¥',
        list: [
            item('/pages/componentsB/goodsList/index', 'GoodsList 商品列表', 'GoodsList', '展示商品网格、价格与业务状态。', true),
            item('/pages/componentsB/activityList/index', 'ActivityList 活动列表', 'ActivityList', '展示并选择活动或拍卖场次。', true),
            item('/pages/componentsB/filterSorts/index', 'FilterSorts 筛选排序', 'FilterSorts', '商品排序与多条件筛选入口。', true),
            item('/pages/componentsB/listSwitching/index', 'ListSwitching 列表切换', 'ListSwitching', '在列表和宫格商品布局之间切换。', true),
            item('/pages/componentsB/coupon/index', 'Coupon 优惠券', 'Coupon', '展示优惠券状态并提供领取入口。', true)
        ]
    }
];

export default componentGroups;
