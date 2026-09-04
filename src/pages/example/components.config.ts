// 分包目录负责路由组织；该配置只表达用户可理解的语义分类。
export interface SnakeComponentItem {
    path: string;
    title: string;
    titleEn: string;
    desc: string;
    cms?: boolean;
}

export interface SnakeComponentGroup {
    groupName: string;
    groupNameEn: string;
    icon: string;
    list: SnakeComponentItem[];
}

const item = (path: string, title: string, titleEn: string, desc: string, cms = false): SnakeComponentItem => ({
    path,
    title,
    titleEn,
    desc,
    cms
});

const componentGroups: SnakeComponentGroup[] = [
    {
        groupName: '基础组件',
        groupNameEn: 'Foundation',
        icon: '◈',
        list: [
            item(
                '/pages/componentsA/button/index',
                'Button 按钮',
                'Button',
                '触发即时操作，支持主题、朴素、禁用和加载状态。'
            ),
            item(
                '/pages/componentsA/loadingIcon/index',
                'LoadingIcon 加载图标',
                'LoadingIcon',
                '统一展示组件和页面中的加载状态。'
            ),
            item(
                '/pages/componentsA/transition/index',
                'Transition 过渡动画',
                'Transition',
                '提供一致的跨端进出场动画。'
            ),
            item(
                '/pages/componentsA/text/index',
                'Text 文本',
                'Text',
                '价格、脱敏、日期与链接等常用文本场景。'
            ),
            item(
                '/pages/componentsA/link/index',
                'Link 超链接',
                'Link',
                '跨端打开链接或复制到粘贴板。'
            ),
            item('/pages/componentsA/icon/index', 'Icon 图标', 'Icon', '常用图标集合，支持自定义尺寸与颜色。')
        ]
    },
    {
        groupName: '表单组件',
        groupNameEn: 'Form',
        icon: '✓',
        list: [
            item('/pages/componentsA/form/index', 'Form 表单', 'Form', '统一管理字段、规则校验、重置和错误状态。'),
            item('/pages/componentsA/formItem/index', 'FormItem 表单项', 'FormItem', '连接标签、字段控件和校验结果。'),
            item('/pages/componentsA/input/index', 'Input 输入框', 'Input', '单行输入，支持清空、密码和前后插槽。'),
            item(
                '/pages/componentsA/textarea/index',
                'Textarea 文本域',
                'Textarea',
                '多行输入，支持自适应高度和字数统计。'
            ),
            item('/pages/componentsA/checkbox/index', 'Checkbox 复选框', 'Checkbox', '独立或成组选择多个值。'),
            item(
                '/pages/componentsA/checkboxGroup/index',
                'CheckboxGroup 复选框组',
                'CheckboxGroup',
                '管理复选值和最大选择数。'
            ),
            item('/pages/componentsA/radio/index', 'Radio 单选框', 'Radio', '独立或成组选择单个值。'),
            item('/pages/componentsA/radioGroup/index', 'RadioGroup 单选框组', 'RadioGroup', '管理互斥单选值。'),
            item('/pages/componentsA/switch/index', 'Switch 开关', 'Switch', '切换布尔值或自定义开关值。'),
            item('/pages/componentsA/slider/index', 'Slider 滑动选择器', 'Slider', '通过点击或触摸拖动选择数值。'),
            item(
                '/pages/componentsA/search/index',
                'Search 搜索框',
                'Search',
                '集成占位、清除与操作按钮的常用搜索输入。'
            ),
            item(
                '/pages/componentsA/select/index',
                'Select 列选择器',
                'Select',
                '单列、多列与多列联动的底部选择器。'
            ),
            item(
                '/pages/componentsA/countDown/index',
                'CountDown 倒计时',
                'Count Down',
                '用于活动截止等场景的倒计时。'
            ),
            item(
                '/pages/componentsA/calendar/index',
                'Calendar 日历',
                'Calendar',
                '单个或范围日期选择，支持农历与节日。'
            )
        ]
    },
    {
        groupName: '展示组件',
        groupNameEn: 'Display',
        icon: '▦',
        list: [
            item('/pages/componentsA/image/index', 'Image 图片', 'Image', '图片展示，支持占位、圆角与自适应模式。'),
            item(
                '/pages/componentsA/lazyImage/index',
                'LazyImage 懒加载图片',
                'LazyImage',
                '图片进入视口后加载，并提供失败反馈。'
            ),
            item('/pages/componentsA/noticeBar/index', 'NoticeBar 通知栏', 'NoticeBar', '支持横向通知与纵向多条轮播。'),
            item(
                '/pages/componentsA/lineProgress/index',
                'LineProgress 线形进度条',
                'LineProgress',
                '以线形进度展示任务完成情况，支持条纹与百分比。'
            ),
            item(
                '/pages/componentsA/readMore/index',
                'ReadMore 阅读更多',
                'ReadMore',
                '长内容先收起一部分，点击展开全文。'
            ),
            item('/pages/componentsA/swiper/index', 'Swiper 轮播图', 'Swiper', '支持自动播放、指示器与标题展示。'),
            item(
                '/pages/componentsB/images/index',
                'Images 图片展示',
                'Images',
                '按装修数据展示单图或多图内容。',
                true
            ),
            item('/pages/componentsB/videos/index', 'Videos 视频', 'Videos', '在装修页面中承载视频播放内容。', true),
            item(
                '/pages/componentsB/richText/index',
                'RichText 富文本',
                'RichText',
                '渲染后台编辑的图文和格式化内容。',
                true
            ),
            item('/pages/componentsB/notice/index', 'Notice 公告', 'Notice', '在装修页面中滚动展示业务公告。', true)
        ]
    },
    {
        groupName: '反馈与浮层',
        groupNameEn: 'Feedback',
        icon: '◉',
        list: [
            item('/pages/componentsA/empty/index', 'Empty 空状态', 'Empty', '空数据占位并提供清晰的下一步提示。'),
            item(
                '/pages/componentsA/loadmore/index',
                'Loadmore 加载更多',
                'Loadmore',
                '反馈可加载、加载中和没有更多状态。'
            ),
            item('/pages/componentsA/overlay/index', 'Overlay 遮罩层', 'Overlay', '隔离当前页面与浮层操作。'),
            item('/pages/componentsA/popup/index', 'Popup 弹出层', 'Popup', '支持从不同方向出现并承载业务内容。'),
            item(
                '/pages/componentsA/noNetwork/index',
                'NoNetwork 无网络提示',
                'NoNetwork',
                '自动监听网络状态，断网时全屏提示并支持重试。'
            ),
            item(
                '/pages/componentsB/pagePopup/index',
                'PagePopup 页面弹窗',
                'PagePopup',
                '根据业务场景展示营销弹窗。',
                true
            )
        ]
    },
    {
        groupName: '导航与布局',
        groupNameEn: 'Navigation',
        icon: '⌘',
        list: [
            item('/pages/componentsA/navbar/index', 'Navbar 导航栏', 'Navbar', '用于页面顶部导航并处理返回与安全区。'),
            item('/pages/componentsA/sticky/index', 'Sticky 吸顶', 'Sticky', '滚动时将重要内容固定在页面顶部。'),
            item('/pages/componentsA/tabs/index', 'Tabs 标签页', 'Tabs', '在同层级内容之间快速切换。'),
            item(
                '/pages/componentsA/subsection/index',
                'Subsection 分段选择器',
                'Subsection',
                '在少量互斥选项之间快速切换。'
            ),
            item(
                '/pages/componentsA/buttonSort/index',
                'ButtonSort 排序按钮',
                'ButtonSort',
                '在升序、降序和默认状态之间循环切换。'
            ),
            item(
                '/pages/componentsA/dropMenu/index',
                'DropMenu 下拉菜单',
                'DropMenu',
                '协调多个下拉菜单项的展开与关闭。'
            ),
            item(
                '/pages/componentsA/dropMenuItem/index',
                'DropMenuItem 下拉菜单项',
                'DropMenuItem',
                '提供下拉触发器和内容面板。'
            ),
            item(
                '/pages/componentsA/indexList/index',
                'IndexList 索引列表',
                'IndexList',
                '通过右侧索引快速定位分组内容。'
            ),
            item(
                '/pages/componentsA/indexAnchor/index',
                'IndexAnchor 索引锚点',
                'IndexAnchor',
                '定义索引列表中的内容分组位置。'
            ),
            item(
                '/pages/componentsA/cellGroup/index',
                'CellGroup 单元格分组',
                'CellGroup',
                '将一组单元格组合为带标题和外边框的分组。'
            ),
            item(
                '/pages/componentsA/cellItem/index',
                'CellItem 单元格条目',
                'CellItem',
                '带图标、标题、描述和箭头的单行列表条目。'
            ),
            item('/pages/componentsA/line/index', 'Line 分隔线', 'Line', '以横向或竖向线条分隔内容块，支持半像素细线。'),
            item(
                '/pages/componentsB/auxiliarySegmentation/index',
                'AuxiliarySegmentation 辅助分割',
                'AuxiliarySegmentation',
                '在装修区块之间提供留白或分隔线。',
                true
            ),
            item(
                '/pages/componentsB/graphicNavigation/index',
                'GraphicNavigation 图文导航',
                'GraphicNavigation',
                '图标与文字组合的快捷导航入口。',
                true
            ),
            item(
                '/pages/componentsB/commoditySearch/index',
                'CommoditySearch 商品搜索',
                'CommoditySearch',
                '商城装修页面中的商品搜索入口。',
                true
            ),
            item(
                '/pages/componentsB/floatingBubble/index',
                'FloatingBubble 悬浮气泡',
                'FloatingBubble',
                '始终可见的营销或客服入口。',
                true
            )
        ]
    },
    {
        groupName: 'CMS 内容',
        groupNameEn: 'CMS Content',
        icon: 'C',
        list: [
            item(
                '/pages/componentsB/snakeCms/index',
                'Snake CMS 装修容器',
                'Snake CMS',
                '按配置顺序渲染完整的 CMS 页面。',
                true
            ),
            item(
                '/pages/componentsB/customModule/index',
                'CustomModule 自定义模块',
                'CustomModule',
                '通过命名插槽接入业务自定义内容。',
                true
            ),
            item(
                '/pages/componentsB/hotzone/index',
                'Hotzone 热区图',
                'Hotzone',
                '在背景图上按百分比热区点击跳转，链接由装修编辑器配置。',
                true
            )
        ]
    },
    {
        groupName: 'CMS 营销',
        groupNameEn: 'CMS Marketing',
        icon: 'M',
        list: [
            item(
                '/pages/componentsB/pictureAds/index',
                'PictureAds 轮播广告',
                'PictureAds',
                '焦点广告轮播，支持间距、圆角与间隔。',
                true
            ),
            item(
                '/pages/componentsB/magicCube/index',
                'MagicCube 魔方布局',
                'MagicCube',
                '可配置宫格组合营销图片和入口。',
                true
            ),
            item(
                '/pages/componentsB/jumpApplet/index',
                'JumpApplet 小程序跳转',
                'JumpApplet',
                '通过按钮触发目标小程序跳转。',
                true
            ),
            item('/pages/componentsB/follow/index', 'Follow 关注', 'Follow', '引导用户关注公众号或品牌账号。', true),
            item('/pages/componentsB/coupon/index', 'Coupon 优惠券', 'Coupon', '展示优惠券状态并提供领取入口。', true)
        ]
    },
    {
        groupName: '商品业务',
        groupNameEn: 'Commerce',
        icon: '¥',
        list: [
            item(
                '/pages/componentsB/goodsList/index',
                'GoodsList 商品列表',
                'GoodsList',
                '展示商品网格、价格与业务状态。',
                true
            ),
            item(
                '/pages/componentsB/activityList/index',
                'ActivityList 活动列表',
                'ActivityList',
                '展示并选择活动或拍卖场次。',
                true
            ),
            item(
                '/pages/componentsB/filterSorts/index',
                'FilterSorts 筛选排序',
                'FilterSorts',
                '商品排序与多条件筛选入口。',
                true
            ),
            item(
                '/pages/componentsB/listSwitching/index',
                'ListSwitching 列表切换',
                'ListSwitching',
                '在列表和宫格商品布局之间切换。',
                true
            )
        ]
    }
];

export default componentGroups;
