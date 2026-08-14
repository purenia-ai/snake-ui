export type DemoValue = string | number | boolean

export interface DemoOption {
  label: string
  value: DemoValue
}

export interface DemoControl {
  key: string
  label: string
  type: 'select' | 'switch' | 'slider' | 'input'
  defaultValue: DemoValue
  options?: DemoOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  placeholder?: string
}

export interface DemoDefinition {
  category: string
  description: string
  controls: DemoControl[]
}

const boolOptions: DemoOption[] = [
  { label: '开启', value: true },
  { label: '关闭', value: false },
]

const definitions: Record<string, DemoDefinition> = {
  button: { category: '基础组件', description: '按钮用于触发即时操作，支持主题、朴素、禁用和加载状态。', controls: [
    { key: 'type', label: '按钮主题', type: 'select', defaultValue: 'primary', options: [{ label: '主要', value: 'primary' }, { label: '默认', value: 'default' }] },
    { key: 'plain', label: '朴素样式', type: 'switch', defaultValue: false }, { key: 'loading', label: '加载状态', type: 'switch', defaultValue: false }, { key: 'disabled', label: '禁用状态', type: 'switch', defaultValue: false },
  ] },
  empty: { category: '反馈与浮层', description: '在没有数据时提供清晰的占位和下一步提示。', controls: [
    { key: 'text', label: '提示文字', type: 'input', defaultValue: '暂无相关内容', placeholder: '输入空状态文案' }, { key: 'showIcon', label: '显示图标', type: 'switch', defaultValue: true }, { key: 'textColor', label: '文字颜色', type: 'select', defaultValue: '#7b8d84', options: [{ label: '灰色', value: '#7b8d84' }, { label: '品牌绿', value: '#00a86f' }] },
  ] },
  icon: { category: '基础组件', description: '展示 Snake UI 内置图标，可调整尺寸和主题颜色。', controls: [
    { key: 'iconColor', label: '图标颜色', type: 'select', defaultValue: '#00a86f', options: [{ label: '品牌绿', value: '#00a86f' }, { label: '深色', value: '#173b2c' }, { label: '警示色', value: '#f59e0b' }] }, { key: 'iconSize', label: '图标尺寸', type: 'slider', defaultValue: 28, min: 18, max: 44, step: 2, unit: 'px' },
  ] },
  image: { category: '展示组件', description: '图片容器支持不同填充模式、圆角和加载失败状态。', controls: [
    { key: 'imageMode', label: '裁剪模式', type: 'select', defaultValue: 'aspectFit', options: [{ label: '完整显示', value: 'aspectFit' }, { label: '填充裁剪', value: 'aspectFill' }] }, { key: 'radius', label: '圆角', type: 'slider', defaultValue: 12, min: 0, max: 32, step: 4, unit: 'rpx' },
  ] },
  'lazy-image': { category: '展示组件', description: '图片进入视口后加载，并展示加载中或失败反馈。', controls: [
    { key: 'lazySource', label: '图片状态', type: 'select', defaultValue: 'normal', options: [{ label: '正常图片', value: 'normal' }, { label: '加载失败', value: 'error' }] },
  ] },
  loadmore: { category: '反馈与浮层', description: '用于列表底部，反馈可加载、加载中和没有更多三种状态。', controls: [
    { key: 'loadStatus', label: '加载状态', type: 'select', defaultValue: 'loadmore', options: [{ label: '加载更多', value: 'loadmore' }, { label: '加载中', value: 'loading' }, { label: '没有更多', value: 'nomore' }] },
  ] },
  'notice-bar': { category: '展示组件', description: '承载重要通知，支持横向展示和纵向轮播。', controls: [
    { key: 'noticeMode', label: '展示模式', type: 'select', defaultValue: 'horizontal', options: [{ label: '横向', value: 'horizontal' }, { label: '纵向', value: 'vertical' }] }, { key: 'noticeIcon', label: '显示图标', type: 'switch', defaultValue: true }, { key: 'noticeDuration', label: '切换间隔', type: 'slider', defaultValue: 1800, min: 1000, max: 4000, step: 200, unit: 'ms' },
  ] },
  overlay: { category: '反馈与浮层', description: '全屏遮罩用于隔离当前页面与浮层操作。', controls: [
    { key: 'overlayTip', label: '遮罩提示', type: 'input', defaultValue: '点击任意位置关闭' },
  ] },
  popup: { category: '反馈与浮层', description: '弹出层支持从页面不同方向出现并承载业务内容。', controls: [
    { key: 'popupMode', label: '弹出方向', type: 'select', defaultValue: 'bottom', options: [{ label: '底部', value: 'bottom' }, { label: '居中', value: 'center' }, { label: '顶部', value: 'top' }] }, { key: 'closeOverlay', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
  ] },
  sticky: { category: '导航与布局', description: '页面滚动时将重要内容固定在指定顶部位置。', controls: [
    { key: 'stickyDisabled', label: '关闭吸顶', type: 'switch', defaultValue: false }, { key: 'stickyOffset', label: '顶部距离', type: 'slider', defaultValue: 0, min: 0, max: 80, step: 10, unit: 'rpx' },
  ] },
  swiper: { category: '展示组件', description: '用于图片或内容轮播，支持自动播放、标题和指示器。', controls: [
    { key: 'swiperIndicator', label: '显示指示器', type: 'switch', defaultValue: true }, { key: 'swiperTitle', label: '显示标题', type: 'switch', defaultValue: true }, { key: 'swiperAutoplay', label: '自动播放', type: 'switch', defaultValue: true }, { key: 'swiperHeight', label: '轮播高度', type: 'slider', defaultValue: 360, min: 220, max: 480, step: 20, unit: 'rpx' }, { key: 'radius', label: '圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'rpx' },
  ] },
  tabs: { category: '导航与布局', description: '标签页用于在同层级内容之间快速切换。', controls: [
    { key: 'tabsScrollable', label: '允许横向滚动', type: 'switch', defaultValue: true }, { key: 'tabsColor', label: '活动颜色', type: 'select', defaultValue: '#00a86f', options: [{ label: '品牌绿', value: '#00a86f' }, { label: '蓝色', value: '#2563eb' }, { label: '橙色', value: '#f59e0b' }] }, { key: 'tabsSize', label: '文字尺寸', type: 'slider', defaultValue: 28, min: 22, max: 36, step: 2, unit: 'rpx' },
  ] },
  'button-sort': { category: '导航与布局', description: '点击后在默认、升序和降序状态之间循环切换。', controls: [{ key: 'sortTitle', label: '按钮文字', type: 'input', defaultValue: '价格排序' }] },
  'drop-menu': { category: '导航与布局', description: '下拉菜单容器保证同一时间只展开一个菜单项。', controls: [{ key: 'menuTitle', label: '菜单标题', type: 'input', defaultValue: '筛选条件' }] },
  'drop-menu-item': { category: '导航与布局', description: '下拉菜单项提供触发按钮、内容面板和关闭事件。', controls: [{ key: 'menuTitle', label: '菜单标题', type: 'input', defaultValue: '全部分类' }] },
  'index-list': { category: '导航与布局', description: '通过右侧索引快速定位列表中的分组内容。', controls: [{ key: 'indexColor', label: '活动颜色', type: 'select', defaultValue: '#00a86f', options: [{ label: '品牌绿', value: '#00a86f' }, { label: '蓝色', value: '#2563eb' }] }] },
  'index-anchor': { category: '导航与布局', description: '索引锚点定义分组位置，需要放在 IndexList 内使用。', controls: [{ key: 'anchorPrefix', label: '分组前缀', type: 'input', defaultValue: '分组' }] },
  'snake-cms': { category: 'CMS 内容', description: '根据页面装修配置按顺序渲染完整的 CMS 页面。', controls: [{ key: 'cmsScene', label: '页面场景', type: 'select', defaultValue: 'full', options: [{ label: '完整页面', value: 'full' }, { label: '内容精简', value: 'simple' }] }] },
  'custom-module': { category: 'CMS 内容', description: '通过命名插槽接入业务自定义内容。', controls: [{ key: 'moduleText', label: '插槽内容', type: 'input', defaultValue: '业务插槽可以在这里承载任意内容' }] },
  images: { category: 'CMS 内容', description: '按照装修数据展示单图或多图内容。', controls: [{ key: 'contentMargin', label: '页面边距', type: 'slider', defaultValue: 20, min: 0, max: 40, step: 4, unit: 'rpx' }] },
  'picture-ads': { category: 'CMS 营销', description: '用于焦点广告轮播，支持间距、圆角和播放间隔。', controls: [{ key: 'adRadius', label: '广告圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'rpx' }, { key: 'adInterval', label: '播放间隔', type: 'slider', defaultValue: 3000, min: 1500, max: 5000, step: 500, unit: 'ms' }] },
  'magic-cube': { category: 'CMS 营销', description: '通过可配置宫格组合营销图片和入口。', controls: [{ key: 'cubeRadius', label: '图片圆角', type: 'slider', defaultValue: 12, min: 0, max: 28, step: 4, unit: 'rpx' }, { key: 'cubeMargin', label: '图片间距', type: 'slider', defaultValue: 8, min: 0, max: 24, step: 4, unit: 'rpx' }] },
  videos: { category: 'CMS 内容', description: '在装修页面中承载视频播放内容。', controls: [{ key: 'videoScene', label: '视频状态', type: 'select', defaultValue: 'empty', options: [{ label: '占位演示', value: 'empty' }, { label: '本地场景', value: 'local' }] }] },
  'rich-text': { category: 'CMS 内容', description: '渲染后台编辑的图文和格式化内容。', controls: [{ key: 'richHeading', label: '内容标题', type: 'input', defaultValue: 'Snake UI' }] },
  notice: { category: 'CMS 内容', description: '在装修页面中滚动展示多条业务公告。', controls: [{ key: 'noticeDirection', label: '滚动方向', type: 'select', defaultValue: 'column', options: [{ label: '纵向', value: 'column' }, { label: '横向', value: 'row' }] }, { key: 'noticeCmsIcon', label: '显示图标', type: 'switch', defaultValue: true }] },
  'auxiliary-segmentation': { category: '导航与布局', description: '在装修区块之间提供留白或分隔线。', controls: [{ key: 'segmentHeight', label: '分隔高度', type: 'slider', defaultValue: 32, min: 8, max: 80, step: 8, unit: 'rpx' }] },
  'graphic-navigation': { category: '导航与布局', description: '以图标和文字组合多个快捷导航入口。', controls: [{ key: 'navRadius', label: '图标圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'rpx' }, { key: 'navTextColor', label: '文字颜色', type: 'select', defaultValue: '#24342c', options: [{ label: '深色', value: '#24342c' }, { label: '品牌绿', value: '#00a86f' }] }] },
  'commodity-search': { category: 'CMS 内容', description: '在商城装修页面中提供商品搜索入口。', controls: [{ key: 'searchPlaceholder', label: '占位文字', type: 'input', defaultValue: '搜索 Snake UI 组件' }, { key: 'searchRadius', label: '输入框圆角', type: 'slider', defaultValue: 36, min: 0, max: 40, step: 4, unit: 'rpx' }] },
  suspension: { category: 'CMS 营销', description: '在页面边缘提供始终可见的营销或客服入口。', controls: [{ key: 'suspensionSize', label: '入口尺寸', type: 'slider', defaultValue: 96, min: 64, max: 128, step: 8, unit: 'rpx' }] },
  'page-popup': { category: 'CMS 营销', description: '根据业务场景展示居中或底部营销弹窗。', controls: [{ key: 'pagePopupMode', label: '弹窗位置', type: 'select', defaultValue: 'center', options: [{ label: '居中', value: 'center' }, { label: '底部', value: 'bottom' }] }] },
  'jump-applet': { category: 'CMS 营销', description: '通过按钮触发目标小程序跳转。', controls: [{ key: 'appletTitle', label: '按钮文字', type: 'input', defaultValue: '打开小程序' }, { key: 'appletColor', label: '按钮颜色', type: 'select', defaultValue: '#00a86f', options: [{ label: '品牌绿', value: '#00a86f' }, { label: '深色', value: '#173b2c' }] }] },
  follow: { category: 'CMS 营销', description: '用于引导用户关注公众号或品牌账号。', controls: [{ key: 'followScene', label: '展示场景', type: 'select', defaultValue: 'default', options: [{ label: '默认状态', value: 'default' }, { label: '强调状态', value: 'strong' }] }] },
  'goods-list': { category: '商品业务', description: '展示商品网格或列表，并承载价格和状态信息。', controls: [{ key: 'goodsMode', label: '列表类型', type: 'select', defaultValue: 'sale', options: [{ label: '在售', value: 'sale' }, { label: '默认', value: 'default' }] }, { key: 'goodsMargin', label: '页面边距', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 5, unit: 'rpx' }] },
  'activity-list': { category: '商品业务', description: '展示活动或拍卖场次，并支持选择当前场次。', controls: [{ key: 'activityScene', label: '活动数据', type: 'select', defaultValue: 'all', options: [{ label: '全部场次', value: 'all' }, { label: '单个场次', value: 'single' }] }] },
  'filter-sorts': { category: '商品业务', description: '提供商品排序和多条件筛选入口。', controls: [{ key: 'filterTabs', label: '显示筛选标签', type: 'switch', defaultValue: true }, { key: 'filterBg', label: '背景颜色', type: 'select', defaultValue: '#ffffff', options: [{ label: '白色', value: '#ffffff' }, { label: '浅绿', value: '#eef6f1' }] }] },
  'list-switching': { category: '商品业务', description: '在列表和宫格商品布局之间切换。', controls: [{ key: 'listLayout', label: '默认布局', type: 'select', defaultValue: 0, options: [{ label: '宫格', value: 0 }, { label: '列表', value: 1 }] }, { key: 'listRadius', label: '卡片圆角', type: 'slider', defaultValue: 12, min: 0, max: 28, step: 4, unit: 'rpx' }] },
  coupon: { category: 'CMS 营销', description: '展示优惠券状态并提供领取入口。', controls: [{ key: 'couponMode', label: '展示模式', type: 'select', defaultValue: 'page', options: [{ label: '页面', value: 'page' }, { label: '弹窗', value: 'popup' }] }] },
}

export function getDemoDefinition(kind: string): DemoDefinition {
  return definitions[kind] ?? { category: '组件', description: '查看组件的实时演示与参数配置。', controls: [] }
}

export function createDemoState(kind: string): Record<string, DemoValue> {
  return Object.fromEntries(getDemoDefinition(kind).controls.map((control) => [control.key, control.defaultValue]))
}

export const demoKinds = Object.keys(definitions)
export { boolOptions }
