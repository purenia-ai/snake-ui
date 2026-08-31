export interface SnakeGoodsListItem extends Record<string, any> {
    id?: string | number;
    image?: string;
    name?: string;
    goodsName?: string;
    price?: string | number;
    discountPrice?: string | number;
    amount?: number;
    status?: string | number;
    activityInfo?: Record<string, any>;
}

export interface SnakeGoodsListProps<Item extends SnakeGoodsListItem = SnakeGoodsListItem> {
    goodsList?: Item[];
    bgColor?: string;
    listType?: string;
    pageMargin?: number;
    imageMargin?: number;
    commodityType?: number;
    attendanceShow?: boolean;
    assets?: Record<string, string>;
}

export interface SnakeGoodsListEmits<Item extends SnakeGoodsListItem = SnakeGoodsListItem> {
    'item-click': [item: Item, index: number];
    handlerOffer: [item: Item, index: number];
}
