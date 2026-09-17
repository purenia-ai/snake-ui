/** GoodsList 数据项。 */
export interface GoodsListItem extends Record<string, any> {
    /** 数据唯一标识。 */
    id?: string | number;
    /** 图片地址。 */
    image?: string;
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 商品名称。 */
    goodsName?: string;
    /** 商品价格。 */
    price?: string | number;
    /** 商品折扣价格。 */
    discountPrice?: string | number;
    /** 商品数量或库存。 */
    amount?: number;
    /** 当前状态。 */
    status?: string | number;
    /** 商品关联的活动信息。 */
    activityInfo?: Record<string, any>;
}

/** GoodsList 组件的公开属性。 */
export interface GoodsListProps<Item extends GoodsListItem = GoodsListItem> {
    /** 商品数据列表。 */
    goodsList?: Item[];
    /** 背景颜色。 */
    bgColor?: string;
    /** 商品列表展示类型。 */
    listType?: string;
    /** 列表与页面边缘的间距。 */
    pageMargin?: number;
    /** 商品卡片之间的间距。 */
    imageMargin?: number;
    /** 商品卡片布局类型。 */
    commodityType?: number;
    /** 是否显示拍卖参与人数。 */
    attendanceShow?: boolean;
    /** 组件使用的可替换资源地址。 */
    assets?: Record<string, string>;
    /** 商品排列方式。 */
    layout?: 'grid' | 'swipe';
    /** 商品卡片圆角，单位 rpx。 */
    cardRadius?: number;
    /** 是否显示营销标签。 */
    showTag?: boolean;
}

/** GoodsList 组件的事件契约。 */
export type GoodsListEmits<Item extends GoodsListItem = GoodsListItem> = {
    /** item-click 事件携带的参数。 */
    'item-click': [item: Item, index: number];
    /** handlerOffer 事件携带的参数。 */
    handlerOffer: [item: Item, index: number];
};
