<template>
    <view v-if="list.length" class="activity-list">
        <scroll-view
            class="scroll-view"
            :scroll-x="list.length > 3"
            :scroll-left="tabsScrollLeft"
            :scroll-with-animation="true"
        >
            <view class="activity-list__nav" role="tablist" aria-label="活动场次">
                <template v-for="(item, index) in list" :key="index">
                    <view
                        class="activity-list__item"
                        :class="{
                            'activity-list__item--active': current == item.id,
                            'activity-list__item--clicking': clickingIndex == index
                        }"
                        role="tab"
                        :aria-selected="current == item.id"
                        :tabindex="current == item.id ? 0 : -1"
                        @click="handelClick(item, index)"
                        @keydown.enter.prevent="handelClick(item, index)"
                        @keydown.space.prevent="handelClick(item, index)"
                        @keydown.left.prevent="selectAdjacent(index, -1)"
                        @keydown.right.prevent="selectAdjacent(index, 1)"
                    >
                        <!-- 图片 -->
                        <image
                            class="activity-list__image"
                            :src="item.squareImage || 'https://s.qiuxietang.com/images/202507/1390637519904706560.png'"
                            mode="aspectFill"
                        ></image>
                        <!-- 倒计时 -->
                        <view class="activity-list__time" :style="timeStyle(item)">
                            <view
                                class="activity-list__time-box"
                                v-if="item.endTime"
                                :style="{
                                    backgroundColor:
                                        currentTime > item.startTime ? 'var(--snake-color-error, #ff525d)' : ''
                                }"
                            >
                                <text v-if="currentTime < item.startTime">拍卖预告</text>
                                <template v-else>
                                    <view class="activity-list__time-icon">
                                        <snake-icon name="clock" size="20rpx" color="var(--snake-color-white, #ffffff)"></snake-icon>
                                    </view>
                                    <text class="activity-list__countdown">
                                        {{ uni.$snake.formatTime(item.endTime, 'mm-dd hh:MM') }}
                                    </text>
                                </template>
                            </view>
                        </view>
                        <!-- 标题 -->
                        <view class="activity-list__title" v-if="index !== 0">
                            <text class="activity-list__title-main">{{ item.name }}</text>
                            <text class="activity-list__title-sub" v-if="currentTime > item.startTime">{{
                                item.subtitle
                            }}</text>
                            <text class="activity-list__title-time activity-list__title-time--din" v-else>
                                {{ uni.$snake.formatTime(item.startTime, 'mm-dd') }}
                                <text class="activity-list__title-time--open">开场</text>
                            </text>
                        </view>
                    </view>
                </template>
            </view>
        </scroll-view>
    </view>
</template>

<script>
/**
 * @component SnakeActivityList
 * @description 横向展示拍卖活动入口、时间状态和当前选中项，并自动将当前项滚动到容器中部。
 * @see /components/activity-list
 */

import SnakeIcon from '../snake-icon/snake-icon.vue';

export default {
    name: 'activity-list',
    options: { virtualHost: true, styleIsolation: 'shared' },
    components: { SnakeIcon },
    emits: ['change'],
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        current: {
            type: [String, Number],
            default: '001'
        }
    },
    data() {
        return {
            tabsScrollLeft: 0,
            currentIndex: 0,
            clickingIndex: -1,
            clickTimer: undefined
        };
    },
    computed: {
        currentTime() {
            return Date.now();
        },
        timeStyle() {
            return item => {
                const style = {};
                if (this.current === item.id) {
                    style.top = '0rpx';
                    style.left = '0rpx';
                }
                return style;
            };
        }
    },
    async mounted() {
        await uni.$snake.sleep(30);
        this.list.forEach((item, index) => {
            if (this.current === item.id) {
                this.currentIndex = index;
                this.scrollIntoView();
            }
        });
    },
    beforeUnmount() {
        clearTimeout(this.clickTimer);
    },
    methods: {
        handelClick(item, index) {
            // 触发点击动画
            this.clickingIndex = index;

            // 150ms后结束点击动画
            clearTimeout(this.clickTimer);
            this.clickTimer = setTimeout(() => {
                this.clickingIndex = -1;
            }, 150);

            this.currentIndex = index;
            this.$emit('change', item, index);
            this.scrollIntoView();
        },
        selectAdjacent(index, direction) {
            if (!this.list.length) return;
            const nextIndex = (index + direction + this.list.length) % this.list.length;
            this.handelClick(this.list[nextIndex], nextIndex);
        },
        // 计算tab位置
        scrollIntoView() {
            // item滚动
            this.getElementData('.activity-list__nav', data => {
                const list = data[0];
                this.getElementData('.activity-list__item', data2 => {
                    const el = data2[this.currentIndex];
                    this.tabsScrollLeft = el && el.width / 2 + -list.left + el.left - list.width / 2;
                });
            });
        },
        getElementData(el, callback) {
            uni.createSelectorQuery()
                .in(this)
                .selectAll(el)
                .boundingClientRect()
                .exec(data => {
                    callback(data?.[0] || []);
                });
        }
    }
};
</script>

<style scoped lang="scss">
/* 隐藏滚动条样式 */
.scroll-view {
    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

.activity-list {
    width: 100%;

    /* 导航容器 */
    &__nav {
        display: flex;
        align-items: flex-start;
        width: 100%;
        padding: 10rpx 20rpx;
        // box-sizing: border-box;
    }

    /* 活动项 */
    &__item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 180rpx;
        min-width: 180rpx;
        height: 180rpx;
        overflow: hidden;
        cursor: pointer;
        border-radius: 4rpx;
        transform: translateZ(0); // 启用硬件加速
        transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, box-shadow, border-color; // 性能优化

        /* 相邻项间距 */
        + .activity-list__item {
            margin-left: 20rpx;
        }

        /* 点击动画效果 */
        &--clicking {
            transform: scale(0.95);
            // filter: brightness(0.92);
            // box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.12);
        }

        /* 激活状态样式 */
        &--active {
            width: 195rpx;
            min-width: 195rpx;
            height: 195rpx;
            border: 4rpx solid #2d57e7;
            border-radius: 4rpx;
            // box-shadow: 0 6rpx 16rpx rgba(45, 87, 231, 0.3);
            transform: translateY(-4rpx);
        }
    }

    /* 活动图片 */
    &__image {
        display: block;
        width: 100%;
        height: 100%;
        transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 点击时图片效果 */
    &__item--clicking &__image {
        transform: scale(1.02);
    }

    /* 激活时图片效果 */
    &__item--active &__image {
        box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.3);
    }

    /* 倒计时容器 */
    &__time {
        position: absolute;
        top: 0;
        left: 0;
        transition:
            top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 倒计时盒子 */
    &__time-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36rpx;
        padding-right: 20rpx;
        padding-left: 10rpx;
        font-family: 'DIN-Schrift';
        font-size: 20rpx;
        line-height: 36rpx;
        color: var(--snake-color-white, #ffffff);
        background: var(--snake-color-text-secondary, #707184);
        border-radius: 0rpx 0 4rpx 0;
        transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 倒计时文本 */
    &__countdown {
        min-width: 100%;
        height: 36rpx;
    }

    /* 倒计时图标 */
    &__time-icon {
        margin-right: 4rpx;
    }

    /* 标题容器 */
    &__title {
        position: absolute;
        top: 44rpx;
        left: 12rpx;
        display: flex;
        flex-direction: column;
        font-family: PingFangSC-Semibold;
        font-size: 26rpx;
        color: var(--snake-color-text, #333);
        transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 主标题 */
    &__title-main {
        font-family: PingFangSC-Semibold;
        font-size: 26rpx;
        font-weight: 600;
        color: var(--snake-color-text, #333333);
    }

    /* 副标题 */
    &__title-sub {
        margin-top: 4rpx;
        font-family: PingFangSC-Light;
        font-size: 20rpx;
        font-weight: 300;
        color: var(--snake-color-text-secondary, #666666);
    }

    /* 激活状态标题样式 */
    &__item--active &__title {
        top: 48rpx;
        left: 16rpx;
    }

    &__title-time {
        margin-top: 4rpx;
        font-size: 20rpx;
        color: var(--snake-color-text-muted, #888891);
    }

    &__title-time--din {
        font-family: 'DIN-Schrift';
    }

    &__title-time--open {
        font-weight: 500;
    }
}

@media (prefers-reduced-motion: reduce) {
    .activity-list__item,
    .activity-list__image,
    .activity-list__time,
    .activity-list__time-box,
    .activity-list__title {
        transition: none;
    }
}
</style>
