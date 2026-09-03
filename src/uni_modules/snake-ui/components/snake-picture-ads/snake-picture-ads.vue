<template>
    <view class="pictureads" :style="{ backgroundColor: datas.backgroundColor }">
        <view v-if="!imageList.length" :style="{ height: $snake.addUnit(datas.height * 2, 'rpx') }" class="upload"
            >暂无图片</view
        >
        <!-- 一行一个 -->
        <view
            v-if="imageList.length && datas.swiperType === 0"
            class="swiperType0"
            :style="{ padding: `0 ${datas.pageMargin}rpx` }"
        >
            <view
                v-for="(item, index) in imageList"
                :key="index"
                class="imgLis"
                :style="{ 'margin-bottom': datas.imageMargin + 'rpx', height: $snake.addUnit(datas.height * 2, 'rpx') }"
                @click="uni.$snake.navTo(item.url)"
            >
                <!-- 图片 -->
                <image
                    class="image"
                    show-menu-by-longpress
                    :src="item.src"
                    :style="{ borderRadius: datas.borderRadius + 'rpx' }"
                />
                <!-- 标题 -->
                <text v-if="item.text" class="title">{{ item.text }}</text>
            </view>
        </view>
        <!-- 轮播组件 -->
        <view
            v-if="imageList.length && (datas.swiperType === 1 || datas.swiperType === 2)"
            :style="{ padding: `0 ${datas.pageMargin}rpx` }"
        >
            <snake-swiper
                :list="imageList"
                :previous-margin="swiperMargin"
                :next-margin="swiperMargin"
                circular
                :height="datas.height * 2"
                :autoplay="imageList.length > 0"
                :radius="datas.borderRadius"
                name="src"
                :show-title="true"
                :loading="loading"
                :interval="datas.interval || 3000"
                :indicator-style="datas.pagingType === 'progressbar' ? 'width:100%; top: -2px; zIndex: 999;' : ''"
                @change="change"
                @click="clickPushTo"
            >
                <template #indicator>
                    <view v-if="datas.pagingType">
                        <!-- 指示器 -->
                        <!-- 样式一 -->
                        <view v-if="datas.pagingType === 'bullets'" class="dot-main">
                            <view
                                v-for="(item, index) in imageList"
                                :key="index"
                                class="dot-item"
                                :style="{ backgroundColor: current == index ? datas.indicatorColor : '' }"
                            />
                        </view>
                        <text
                            v-if="datas.pagingType === 'fraction'"
                            class="pagination"
                            :style="{ color: datas.indicatorColor }"
                        >
                            {{ current + 1 }}/{{ imageList.length }}
                        </text>
                        <!-- 样式3 -->
                        <view v-if="datas.pagingType === 'progressbar'" class="progressbar-box">
                            <view
                                class="progressbar"
                                :style="{
                                    width: (100 / imageList.length) * (current + 1) + '%',
                                    backgroundColor: datas.indicatorColor
                                }"
                            />
                        </view>
                    </view>
                </template>
            </snake-swiper>
        </view>
    </view>
</template>

<script>
/**
 * @component SnakePictureAds
 * @description 以纵向图片列表或 Snake UI Swiper 展示广告，支持列表、轮播和指示器配置。
 * @see /components/picture-ads
 */

export default {
    name: 'Pictureads',
    options: { virtualHost: true, styleIsolation: 'shared' },
    props: {
        datas: {
            type: [Object, null],
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            current: 1,
            loading: false
        };
    },
    computed: {
        imageList() {
            return this.datas?.imageList || [];
        },
        // 轮播的前边距 和 后边距
        swiperMargin() {
            let margin = '';
            // #ifdef MP-ALIPAY
            margin = this.datas.swiperType === 2 ? '30rpx' : '';
            // #endif
            // #ifndef MP-ALIPAY
            margin = this.datas.swiperType === 2 ? '60rpx' : '';
            // #endif
            return margin;
        }
    },
    async mounted() {
        await uni.$snake.sleep(300);
        this.loading = false;
    },
    methods: {
        change(e) {
            this.current = e.current;
        },
        clickPushTo(index) {
            const item = this.imageList[index] || {};
            if (item?.startTime && item?.endTime && !item.url) {
                return uni.$snake.toast('活动未开始');
            }
            uni.$snake.navTo(item.url);
        }
    }
};
</script>

<style scoped lang="scss">
:deep(.snake-swiper__indicator) {
    display: none;
}

.pictureads {
    position: relative;

    /* 无图片 */
    .upload {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #ccc;
    }

    // 类型0
    .swiperType0 {
        box-sizing: border-box;

        /* 图片列表 */
        .imgLis {
            position: relative;
            // width: 750rpx;
            width: 100%;
            overflow: hidden;

            /* 图片 */
            .image {
                width: 100%;
                height: 100%;
            }

            .title {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 72rpx;
                line-height: 72rpx;
                color: #fff;
                text-align: center;
                background-color: rgba(51, 51, 51, 0.8);
            }
        }
    }

    /* 类型1 */
    .type1 {
        .swiper-slide {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .swiper-slide-image {
            width: 100%;
            height: 100%;
        }

        .title {
            position: absolute;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            width: 100%;
            height: 36px;
            padding: 0 5px;
            line-height: 36px;
            color: #fff;
            text-align: center;
            text-align: left;
            background-color: rgba(51, 51, 51, 0.8);
        }
    }

    .type3 {
        display: flex;
        align-items: center;
        justify-content: center;

        .swiper-slide {
            /* Center slide text vertically */
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            -webkit-justify-content: center;
            justify-content: center;
            height: 460rpx !important;
            overflow: hidden;
            font-size: 18px;
            text-align: center;
            box-shadow: rgba(147, 147, 147, 0.8) 0px 7px 24px 0px;
            transform: scale(0.93);
            transition: 300ms;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
        }

        .swiper-slide-active {
            height: 400rpx !important;
        }
    }
}

// 轮播
.swiper {
}

// 指示器 样式一
.dot-main {
    display: flex;
    align-items: center;
    justify-content: center;

    .dot-item {
        width: 30rpx;
        height: 4rpx;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.4);
    }
}

// 页码 样式二
.pagination {
    font-size: 28rpx;
}

// 样式三
.progressbar-box {
    width: 100%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.25);
}

.progressbar {
    height: 4px;
    background-color: #007aff;
    transition: 300ms;
}
</style>
