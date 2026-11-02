<template>
    <scroll-view v-if="layout === 'swipe'" scroll-x class="goods-list-scroll" :style="{ backgroundColor: bgColor }">
        <view class="goods-list goods-list--swipe" :style="listStyle">
            <block v-for="(item, index) in goodsList" :key="item.id">
                <view
                    class="item"
                    :style="[itemStyle]"
                    role="link"
                    tabindex="0"
                    :aria-label="`查看商品：${item.name || item.goodsName || item.id || index + 1}`"
                    @click.stop="$emit('item-click', item, index)"
                    @keydown.enter.prevent="$emit('item-click', item, index)"
                    @keydown.space.prevent="$emit('item-click', item, index)"
                >
                    <!-- 图片 -->
                    <view class="card-img" :style="imageStyle">
                        <snake-image
                            :src="imageFilter(item)"
                            :loading-img="assets.goodsLoading || ''"
                            :error-img="assets.goodsError || ''"
                            mode="aspectFill"
                            width="100%"
                            height="100%"
                            lazy-load
                        ></snake-image>

                        <!-- 直购已出售蒙层 -->
                        <template v-if="listType === 'sale' || listType === 'new'">
                            <view
                                class="mantle"
                                v-if="(item.channelStatus === 'off' || item.amount <= 0) && listType === 'sale'"
                            >
                                <image v-if="assets.goodsSoldOut" class="mantle__image" :src="assets.goodsSoldOut" />
                            </view>
                            <view v-if="item.newestTime && item.status === 'selling'" class="dailyNew-time">
                                {{ item.newestTime }}上新
                            </view>
                        </template>

                        <!-- 验货标签 -->
                        <view style="position: absolute; top: 10px; left: 10px" v-if="item.saleType === 'send'">
                            <image
                                v-if="assets.goodsInspection"
                                style="width: 40px; height: 12px"
                                :src="assets.goodsInspection"
                                mode="widthFix"
                            />
                        </view>

                        <!-- 拍卖已出售蒙层 -->
                        <template v-if="listType === 'auction'">
                            <view
                                v-if="
                                    (item.channelStatus === 'off' || item.amount <= 0) &&
                                    item.activityInfo &&
                                    item.activityInfo.status === 'init' &&
                                    item.activityInfo.startTime < Date.now()
                                "
                                class="mantle"
                            >
                                <image v-if="assets.goodsSoldOut" class="mantle__image" :src="assets.goodsSoldOut" />
                            </view>

                            <!-- 标签 -->
                            <view class="auction-tag">
                                <view class="image-warp">
                                    <!-- 新人标签 -->
                                    <template v-if="item.tag">
                                        <image
                                            v-if="assets.goodsNewcomer"
                                            class="new-image"
                                            :src="assets.goodsNewcomer"
                                        />
                                        <view class="tag-text">{{ item.tag.title }}</view>
                                    </template>
                                    <!-- 出价标签 -->
                                    <template
                                        v-if="item.activityInfo && item.activityInfo.attendance && attendanceShow"
                                    >
                                        <image
                                            v-if="assets.goodsPopular"
                                            class="hot-image"
                                            :src="assets.goodsPopular"
                                        />
                                        <view class="tag-text">{{ item.activityInfo.attendance }}人出价中</view>
                                    </template>
                                </view>
                            </view>
                            <!-- 出价价格 -->
                            <view
                                v-if="item.activityInfo && item.activityInfo.myRank"
                                class="auction__tips"
                                :style="tipsStyle(item)"
                            >
                                <text class="price">{{ item.activityInfo.myRank }}</text>
                            </view>
                        </template>
                    </view>

                    <!-- 内容 -->
                    <view class="goods-content">
                        <template v-if="listType === 'sale' || listType === 'new'">
                            <view class="goods-name line-clamp-2">{{ item.name || item.goodsName }}</view>

                            <view class="goods-desc">
                                <view class="price" v-if="isShowPice(item)">
                                    {{ item.price || item.discountPrice || item.jokerPrice || item.salePrice || 0 }}
                                </view>

                                <view class="size" v-if="item.size">
                                    <view class="line-clamp-1" style="max-width: 50px">{{ item.size }}</view>
                                    <view
                                        v-if="item.gradeName || item.grade"
                                        class="line-clamp-1"
                                        style="max-width: 45px"
                                    >
                                        · {{ item.gradeName || item.grade }}
                                    </view>
                                </view>
                                <view v-if="item.type == 'deep' && item.amount" class="stock">
                                    库存 {{ item.amount > 99 ? '99+' : item.amount }}
                                </view>
                            </view>
                            <!-- 标签 -->
                            <view class="goods-tag" v-if="listType === 'sale'">
                                <view
                                    v-if="item.jokerDiscount"
                                    class="item-tags"
                                    style="background: #26273a; border: none"
                                >
                                    <text
                                        style="
                                            font-size: 10px;
                                            line-height: 15px;
                                            color: transparent;
                                            background: linear-gradient(90deg, #dabda8 0%, #eedacc 100%);
                                            -webkit-background-clip: text;
                                        "
                                    >
                                        {{ item.jokerDiscount || '99' }}
                                    </text>
                                </view>
                                <view
                                    v-if="showTag && item.activityInfo && item.activityInfo.activityTag"
                                    class="item-tags"
                                >
                                    {{ item.activityInfo.activityTag }}
                                </view>
                                <view v-if="item.savePrice" class="item-tags">省¥{{ item.savePrice }}</view>
                                <view v-if="showTag && item.activityTag === 'new'" class="item-tags">新人专享</view>
                                <view v-if="showTag && item.activityTag === 'discount'" class="item-tags"
                                    >限时折扣</view
                                >
                                <view
                                    v-if="item.packTag === true"
                                    class="item-tags"
                                    style="color: #2d57e7; background: #eaf1ff; border: 1px solid #2d57e7"
                                >
                                    支持打包
                                </view>
                                <view
                                    v-if="
                                        item.activityInfo &&
                                        item.activityInfo.activityType === 'auction' &&
                                        isEndTime(item)
                                    "
                                    class="item-tags"
                                    style="color: #7a3bff; background: #f3eaff; border: 1px solid #f3eaff"
                                >
                                    捡漏
                                </view>
                            </view>
                        </template>
                        <!--  拍卖 -->
                        <template v-if="listType === 'auction'">
                            <view class="goods-tag" style="padding-bottom: 5px">
                                <view
                                    v-if="item.activityInfo && item.activityInfo.endTime && isEndTime(item)"
                                    class="item-tags"
                                    style="color: #7a3bff; background: #f3eaff; border: 1px solid #f3eaff"
                                >
                                    捡漏
                                </view>
                            </view>
                            <view class="goods-name line-clamp-2">{{ item.size }} | {{ item.name }}</view>
                            <view class="goods-desc">
                                <view class="goods-auction-price">
                                    <view class="price">
                                        <text>{{ (item.activityInfo && item.activityInfo.startPrice) || 0 }}</text>
                                        <text class="text">起报</text>
                                    </view>
                                    <text v-if="listType === 'offer'" class="offer__price">¥1200最高还价</text>
                                </view>
                                <view
                                    class="auction__btn"
                                    hover-class="u-hover-class"
                                    :style="btnBgStyle(item)"
                                    @click.stop="$emit('handlerOffer', item, index)"
                                >
                                    {{
                                        item.activityInfo &&
                                        item.activityInfo.status === 'init' &&
                                        item.activityInfo.startTime > Date.now()
                                            ? '未开始'
                                            : item.activityInfo && item.activityInfo.myPrice
                                              ? '修改报价'
                                              : '参与报价'
                                    }}
                                </view>
                            </view>
                        </template>
                    </view>
                </view>
            </block>
        </view>
    </scroll-view>
    <view v-else class="goods-list" :style="listStyle">
        <block v-for="(item, index) in goodsList" :key="item.id">
            <view
                class="item"
                :style="[itemStyle]"
                role="link"
                tabindex="0"
                :aria-label="`查看商品：${item.name || item.goodsName || item.id || index + 1}`"
                @click.stop="$emit('item-click', item, index)"
                @keydown.enter.prevent="$emit('item-click', item, index)"
                @keydown.space.prevent="$emit('item-click', item, index)"
            >
                <!-- 图片 -->
                <view class="card-img" :style="imageStyle">
                    <snake-image
                        :src="imageFilter(item)"
                        :loading-img="assets.goodsLoading || ''"
                        :error-img="assets.goodsError || ''"
                        mode="aspectFill"
                        width="100%"
                        height="100%"
                        lazy-load
                    ></snake-image>

                    <!-- 直购已出售蒙层 -->
                    <template v-if="listType === 'sale' || listType === 'new'">
                        <view
                            class="mantle"
                            v-if="(item.channelStatus === 'off' || item.amount <= 0) && listType === 'sale'"
                        >
                            <image v-if="assets.goodsSoldOut" class="mantle__image" :src="assets.goodsSoldOut" />
                        </view>
                        <view v-if="item.newestTime && item.status === 'selling'" class="dailyNew-time">
                            {{ item.newestTime }}上新
                        </view>
                    </template>

                    <!-- 验货标签 -->
                    <view style="position: absolute; top: 10px; left: 10px" v-if="item.saleType === 'send'">
                        <image
                            v-if="assets.goodsInspection"
                            style="width: 40px; height: 12px"
                            :src="assets.goodsInspection"
                            mode="widthFix"
                        />
                    </view>

                    <!-- 拍卖已出售蒙层 -->
                    <template v-if="listType === 'auction'">
                        <view
                            v-if="
                                (item.channelStatus === 'off' || item.amount <= 0) &&
                                item.activityInfo &&
                                item.activityInfo.status === 'init' &&
                                item.activityInfo.startTime < Date.now()
                            "
                            class="mantle"
                        >
                            <image v-if="assets.goodsSoldOut" class="mantle__image" :src="assets.goodsSoldOut" />
                        </view>

                        <!-- 标签 -->
                        <view class="auction-tag">
                            <view class="image-warp">
                                <!-- 新人标签 -->
                                <template v-if="item.tag">
                                    <image v-if="assets.goodsNewcomer" class="new-image" :src="assets.goodsNewcomer" />
                                    <view class="tag-text">{{ item.tag.title }}</view>
                                </template>
                                <!-- 出价标签 -->
                                <template v-if="item.activityInfo && item.activityInfo.attendance && attendanceShow">
                                    <image v-if="assets.goodsPopular" class="hot-image" :src="assets.goodsPopular" />
                                    <view class="tag-text">{{ item.activityInfo.attendance }}人出价中</view>
                                </template>
                            </view>
                        </view>
                        <!-- 出价价格 -->
                        <view
                            v-if="item.activityInfo && item.activityInfo.myRank"
                            class="auction__tips"
                            :style="tipsStyle(item)"
                        >
                            <text class="price">{{ item.activityInfo.myRank }}</text>
                        </view>
                    </template>
                </view>

                <!-- 内容 -->
                <view class="goods-content">
                    <template v-if="listType === 'sale' || listType === 'new'">
                        <view class="goods-name line-clamp-2">{{ item.name || item.goodsName }}</view>

                        <view class="goods-desc">
                            <view class="price" v-if="isShowPice(item)">
                                {{ item.price || item.discountPrice || item.jokerPrice || item.salePrice || 0 }}
                            </view>

                            <view class="size" v-if="item.size">
                                <view class="line-clamp-1" style="max-width: 50px">{{ item.size }}</view>
                                <view v-if="item.gradeName || item.grade" class="line-clamp-1" style="max-width: 45px">
                                    · {{ item.gradeName || item.grade }}
                                </view>
                            </view>
                            <view v-if="item.type == 'deep' && item.amount" class="stock">
                                库存 {{ item.amount > 99 ? '99+' : item.amount }}
                            </view>
                        </view>
                        <!-- 标签 -->
                        <view class="goods-tag" v-if="listType === 'sale'">
                            <view v-if="item.jokerDiscount" class="item-tags" style="background: #26273a; border: none">
                                <text
                                    style="
                                        font-size: 10px;
                                        line-height: 15px;
                                        color: transparent;
                                        background: linear-gradient(90deg, #dabda8 0%, #eedacc 100%);
                                        -webkit-background-clip: text;
                                    "
                                >
                                    {{ item.jokerDiscount || '99' }}
                                </text>
                            </view>
                            <view
                                v-if="showTag && item.activityInfo && item.activityInfo.activityTag"
                                class="item-tags"
                            >
                                {{ item.activityInfo.activityTag }}
                            </view>
                            <view v-if="item.savePrice" class="item-tags">省¥{{ item.savePrice }}</view>
                            <view v-if="showTag && item.activityTag === 'new'" class="item-tags">新人专享</view>
                            <view v-if="showTag && item.activityTag === 'discount'" class="item-tags">限时折扣</view>
                            <view
                                v-if="item.packTag === true"
                                class="item-tags"
                                style="color: #2d57e7; background: #eaf1ff; border: 1px solid #2d57e7"
                            >
                                支持打包
                            </view>
                            <view
                                v-if="
                                    item.activityInfo && item.activityInfo.activityType === 'auction' && isEndTime(item)
                                "
                                class="item-tags"
                                style="color: #7a3bff; background: #f3eaff; border: 1px solid #f3eaff"
                            >
                                捡漏
                            </view>
                        </view>
                    </template>
                    <!--  拍卖 -->
                    <template v-if="listType === 'auction'">
                        <view class="goods-tag" style="padding-bottom: 5px">
                            <view
                                v-if="item.activityInfo && item.activityInfo.endTime && isEndTime(item)"
                                class="item-tags"
                                style="color: #7a3bff; background: #f3eaff; border: 1px solid #f3eaff"
                            >
                                捡漏
                            </view>
                        </view>
                        <view class="goods-name line-clamp-2">{{ item.size }} | {{ item.name }}</view>
                        <view class="goods-desc">
                            <view class="goods-auction-price">
                                <view class="price">
                                    <text>{{ (item.activityInfo && item.activityInfo.startPrice) || 0 }}</text>
                                    <text class="text">起报</text>
                                </view>
                                <text v-if="listType === 'offer'" class="offer__price">¥1200最高还价</text>
                            </view>
                            <view
                                class="auction__btn"
                                hover-class="u-hover-class"
                                :style="btnBgStyle(item)"
                                @click.stop="$emit('handlerOffer', item, index)"
                            >
                                {{
                                    item.activityInfo &&
                                    item.activityInfo.status === 'init' &&
                                    item.activityInfo.startTime > Date.now()
                                        ? '未开始'
                                        : item.activityInfo && item.activityInfo.myPrice
                                          ? '修改报价'
                                          : '参与报价'
                                }}
                            </view>
                        </view>
                    </template>
                </view>
            </view>
        </block>
    </view>
</template>

<script>
/**
 * @component GoodsList
 * @description 以自适应卡片网格展示直购、新品或拍卖商品，包含库存、价格、标签和出价状态。
 */

export default {
    name: 'GoodsList',
    emits: ['item-click', 'handlerOffer'],
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    },
    props: {
        goodsList: {
            type: Array,
            default: () => []
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: 'var(--snake-color-background, #f6f6f6)'
        },
        // 商品类型
        listType: {
            type: String,
            default() {
                return 'goods';
            }
        },
        pageMargin: {
            type: Number,
            default: 10
        },
        imageMargin: {
            type: Number,
            default: 10
        },
        commodityType: {
            type: Number,
            default: 0
        },
        attendanceShow: {
            type: Boolean,
            default: true
        },
        assets: {
            type: Object,
            default: () => ({})
        },
        layout: { type: String, default: 'grid' },
        cardRadius: { type: Number, default: 10 },
        showTag: { type: Boolean, default: true }
    },
    data() {
        return {};
    },
    computed: {
        listStyle() {
            return {
                padding: `7.5px ${uni.$snake.from750(this.pageMargin + this.imageMargin)} 0`,
                backgroundColor: this.bgColor
            };
        },
        itemStyle() {
            const style = {
                width:
                    this.layout === 'swipe'
                        ? '150px'
                        : `calc(${100 / (this.commodityType + 2)}% - ${uni.$snake.from750(this.imageMargin)})`,
                borderRadius: uni.$snake.from750(this.cardRadius)
            };
            return style;
        },
        imageStyle() {
            return {
                borderRadius: `${uni.$snake.from750(this.cardRadius)} ${uni.$snake.from750(this.cardRadius)} 0 0`
            };
        },
        // 报价按钮背景颜色
        btnBgStyle() {
            return item => {
                const style = {};
                if (!item.activityInfo?.myPrice) {
                    style.backgroundColor = '#2d57e7';
                    style.color = 'var(--snake-color-white, #fff)';
                }

                if (item.activityInfo?.status === 'init' && item.activityInfo?.startTime > Date.now()) {
                    style.backgroundColor = 'var(--snake-color-surface-muted, #f6f6f6)';
                    style.color = 'var(--snake-color-text-muted, #acacb7)';
                    style.borderColor = 'var(--snake-color-border, #f6f6f6)';
                }
                return style;
            };
        },
        // 出价中背景颜色
        tipsStyle() {
            return item => {
                const style = {};
                if (item.activityInfo?.myRank) {
                    style.backgroundColor = 'var(--snake-color-surface-muted, #e8e8e8)';
                    style.color = 'var(--snake-color-text-muted, #888891)';
                }
                return style;
            };
        },
        isEndTime() {
            return item => {
                const currentTime = Date.now();
                const endTime = item.activityInfo?.endTime || '';
                const timeDifference = endTime - currentTime;
                const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2小时 单位毫秒
                return item.activityInfo?.attendance < 3 && timeDifference <= twoHoursInMilliseconds;
            };
        }
    },
    methods: {
        isShowPice(item) {
            return item?.activityInfo?.activityType !== 'pack';
        },
        imageFilter(item) {
            const image = String(item.image || '').replace(/^http:/, 'https:');
            if (image.indexOf('qiuxietang') > -1 || image.indexOf('puresnake') > -1) {
                if (item.name && item.name.includes('潮服')) {
                    return `${image}?x-oss-process=style/ys`;
                }
                return `${image}?x-oss-process=style/huidi`;
            }
            return image;
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep .u-wrap {
    width: 100% !important;
    background-color: var(--snake-color-surface, #fff) !important;
}

.goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 10px 0;
}
.goods-list-scroll {
    width: 100%;
    white-space: nowrap;
}
.goods-list--swipe {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 5px;
    min-width: 100%;
    box-sizing: border-box;
}
.goods-list--swipe .item {
    display: inline-block;
    flex: 0 0 150px;
    white-space: normal;
}

.item {
    margin-bottom: 10px;
    // width: calc(50% - 5px);
    background: var(--snake-color-surface, #fff);
    border-radius: 5px;
}

.card-img {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 172.5px;
    overflow: hidden;
    border-radius: 5px 5px 0 0;
}

// 已售出蒙层
.mantle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(15, 17, 19, 0.6);

    .mantle__image {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 77.5px;
        height: 77.5px;
        transform: translate(-50%, -50%);
    }
}

.dailyNew-time {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 181px;
    height: 22px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    background: rgba(62, 62, 66, 0.7);
}

// 标签
.auction-tag {
    position: absolute;
    top: 2px;
    right: 8px;

    .image-warp {
        position: relative;

        .new-image {
            width: 79px;
            height: 25px;
        }

        .hot-image {
            width: 88px;
            height: 25px;
        }

        .tag-text {
            position: absolute;
            top: 8px;
            left: 30px;
            overflow: hidden;
            font-family: PingFangSC-Regular;
            font-size: 10px;
            font-weight: 400;
            color: #ffffff;
            white-space: nowrap;
        }
    }
}

.auction__tips {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 22px;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    line-height: 22px;
    color: var(--snake-color-text-muted, #888891);

    .price {
        font-weight: 700;
    }

    .text {
        margin-left: 3px;
    }
}

.goods-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6px 10px 10.5px;
}

.goods-name {
    height: 32px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: var(--snake-color-text, #0f1113);
}

.goods-desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 13px;
    color: var(--snake-color-text, #1f1f27);

    .price {
        font-family: DIN-Bold;
        font-size: 19px;
        font-weight: bold;
        color: var(--snake-color-text, #26273a);

        &::before {
            font-size: 14px;
            content: '¥';
        }
    }

    .size,
    .stock {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        font-weight: 400;
        color: var(--snake-color-text-secondary, #646471);
    }

    .goods-auction-price {
        display: flex;
        flex-direction: column;

        .price {
            font-family: Arial-BoldMT;
            font-size: 18px;
            font-weight: bold;
            color: var(--snake-color-text, #1f1f27);

            &::before {
                font-size: 12px;
                content: '¥';
            }
        }

        .text {
            margin-left: 1px;
            font-family: PingFangSC-Light;
            font-size: 11px;
            font-weight: 300;
            color: var(--snake-color-text-secondary, #646471);
        }

        .offer__price {
            font-size: 12px;
            font-weight: 400;
            color: var(--snake-color-text-secondary, #646471);
        }
    }
}

.auction__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 22px;
    font-family: PingFangSC-Medium;
    font-size: 13px;
    font-weight: 500;
    color: #2d57e7;
    text-align: center;
    // line-height: 22px;
    border: 1px solid #2d57e7;
    border-radius: 1px;
}

.goods-tag {
    display: flex;
    align-items: center;
    margin-top: 4px;

    .item-tags {
        display: flex;
        align-items: center;
        height: 16px;
        padding: 0 4px;
        margin-right: 4px;
        font-size: 10px;
        color: var(--snake-color-error, #fd5b5b);
        white-space: nowrap;
        background: transparent;
        border: 1px solid var(--snake-color-error, #fd5b5b);
        border-radius: 1px;
    }
}
</style>
