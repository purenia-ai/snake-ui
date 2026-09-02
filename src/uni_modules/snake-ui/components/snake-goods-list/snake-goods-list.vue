<template>
    <view
        class="goods-list"
        :style="[$snakeThemeStyle, { padding: `15rpx ${pageMargin + imageMargin}rpx 0`, backgroundColor: bgColor }]"
    >
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
                <view class="card-img">
                    <snake-lazy-image
                        :src="imageFilter(item)"
                        :loading-img="assets.goodsLoading || ''"
                        :error-img="assets.goodsError || ''"
                        mode="aspectFill"
                        width="100%"
                        height="100%"
                    ></snake-lazy-image>

                    <!-- 直购已出售蒙层 -->
                    <template v-if="listType === 'sale' || listType === 'new'">
                        <view
                            class="mantle"
                            v-if="(item.channelStatus === 'off' || item.amount <= 0) && listType === 'sale'"
                        >
                            <image v-if="assets.goodsSoldOut" class="mantle__image" :src="assets.goodsSoldOut" />
                        </view>
                        <view v-if="item.newestTime && item.status === 'selling'" class="dailyNew-time"
                            >{{ item.newestTime }}上新</view
                        >
                    </template>

                    <!-- 验货标签 -->
                    <view style="position: absolute; top: 20rpx; left: 20rpx" v-if="item.saleType === 'send'">
                        <image
                            v-if="assets.goodsInspection"
                            style="width: 80rpx; height: 24rpx"
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
                                <view class="line-clamp-1" style="max-width: 100rpx">{{ item.size }}</view>
                                <view v-if="item.gradeName || item.grade" class="line-clamp-1" style="max-width: 90rpx">
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
                                        font-size: 20rpx;
                                        line-height: 30rpx;
                                        color: transparent;
                                        background: linear-gradient(90deg, #dabda8 0%, #eedacc 100%);
                                        -webkit-background-clip: text;
                                    "
                                >
                                    {{ item.jokerDiscount || '99' }}
                                </text>
                            </view>
                            <view v-if="item.activityInfo && item.activityInfo.activityTag" class="item-tags">
                                {{ item.activityInfo.activityTag }}
                            </view>
                            <view v-if="item.savePrice" class="item-tags">省¥{{ item.savePrice }}</view>
                            <view v-if="item.activityTag === 'new'" class="item-tags">新人专享</view>
                            <view v-if="item.activityTag === 'discount'" class="item-tags">限时折扣</view>
                            <view
                                v-if="item.packTag === true"
                                class="item-tags"
                                style="color: #2d57e7; background: #eaf1ff; border: 2rpx solid #2d57e7"
                            >
                                支持打包
                            </view>
                            <view
                                v-if="
                                    item.activityInfo && item.activityInfo.activityType === 'auction' && isEndTime(item)
                                "
                                class="item-tags"
                                style="color: #7a3bff; background: #f3eaff; border: 2rpx solid #f3eaff"
                            >
                                捡漏
                            </view>
                        </view>
                    </template>
                    <!--  拍卖 -->
                    <template v-if="listType === 'auction'">
                        <view class="goods-tag" style="padding-bottom: 10rpx">
                            <view
                                v-if="item.activityInfo && item.activityInfo.endTime && isEndTime(item)"
                                class="item-tags"
                                style="color: #7a3bff; background: #f3eaff; border: 2rpx solid #f3eaff"
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
 * @component SnakeGoodsList
 * @description 以自适应卡片网格展示直购、新品或拍卖商品，包含库存、价格、标签和出价状态。
 * @see /components/goods-list
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
        }
    },
    data() {
        return {};
    },
    computed: {
        itemStyle() {
            const style = { width: `calc(${100 / (this.commodityType + 2)}% - ${this.imageMargin}rpx)` };
            return style;
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
    padding: 20rpx 20rpx 0;
}

.item {
    margin-bottom: 20rpx;
    // width: calc(50% - 10rpx);
    background: var(--snake-color-surface, #fff);
    border-radius: 10rpx;
}

.card-img {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 345rpx;
    overflow: hidden;
    border-radius: 10rpx 10rpx 0 0;
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
        width: 155rpx;
        height: 155rpx;
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
    width: 362rpx;
    height: 44rpx;
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    background: rgba(62, 62, 66, 0.7);
}

// 标签
.auction-tag {
    position: absolute;
    top: 4rpx;
    right: 16rpx;

    .image-warp {
        position: relative;

        .new-image {
            width: 158rpx;
            height: 50rpx;
        }

        .hot-image {
            width: 176rpx;
            height: 50rpx;
        }

        .tag-text {
            position: absolute;
            top: 16rpx;
            left: 60rpx;
            overflow: hidden;
            font-family: PingFangSC-Regular;
            font-size: 20rpx;
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
    height: 44rpx;
    font-family: PingFangSC-Regular;
    font-size: 20rpx;
    line-height: 44rpx;
    color: var(--snake-color-text-muted, #888891);

    .price {
        font-weight: 700;
    }

    .text {
        margin-left: 6rpx;
    }
}

.goods-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12rpx 20rpx 21rpx;
}

.goods-name {
    height: 64rpx;
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 32rpx;
    color: var(--snake-color-text, #0f1113);
}

.goods-desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 26rpx;
    color: var(--snake-color-text, #1f1f27);

    .price {
        font-family: DIN-Bold;
        font-size: 38rpx;
        font-weight: bold;
        color: var(--snake-color-text, #26273a);

        &::before {
            font-size: 28rpx;
            content: '¥';
        }
    }

    .size,
    .stock {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-family: PingFangSC-Regular;
        font-size: 20rpx;
        font-weight: 400;
        color: var(--snake-color-text-secondary, #646471);
    }

    .goods-auction-price {
        display: flex;
        flex-direction: column;

        .price {
            font-family: Arial-BoldMT;
            font-size: 36rpx;
            font-weight: bold;
            color: var(--snake-color-text, #1f1f27);

            &::before {
                font-size: 24rpx;
                content: '¥';
            }
        }

        .text {
            margin-left: 2rpx;
            font-family: PingFangSC-Light;
            font-size: 22rpx;
            font-weight: 300;
            color: var(--snake-color-text-secondary, #646471);
        }

        .offer__price {
            font-size: 24rpx;
            font-weight: 400;
            color: var(--snake-color-text-secondary, #646471);
        }
    }
}

.auction__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 128rpx;
    height: 44rpx;
    font-family: PingFangSC-Medium;
    font-size: 26rpx;
    font-weight: 500;
    color: #2d57e7;
    text-align: center;
    // line-height: 44rpx;
    border: 2rpx solid #2d57e7;
    border-radius: 2rpx;
}

.goods-tag {
    display: flex;
    align-items: center;
    margin-top: 8rpx;

    .item-tags {
        display: flex;
        align-items: center;
        height: 32rpx;
        padding: 0 8rpx;
        margin-right: 8rpx;
        font-size: 20rpx;
        color: var(--snake-color-error, #fd5b5b);
        white-space: nowrap;
        background: transparent;
        border: 2rpx solid var(--snake-color-error, #fd5b5b);
        border-radius: 2rpx;
    }
}
</style>
