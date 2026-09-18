<template>
    <!-- 外层添加高度 防止高度塌陷 -->
    <view :style="{ height: height }">
        <view :class="{ 'search-fixed': datas.position === 1 }">
            <!-- 搜索 -->
            <view class="search" :style="{ background: datas.backgroundColor, padding: `0 ${datas.pageMargin}rpx` }">
                <!-- 搜索框 -->
                <view
                    class="center"
                    :style="{
                        height: datas.heights + 'rpx',
                        background: datas.borderBgColor,
                        borderRadius: datas.borderRadius + 'rpx',
                        border: datas.showBorder ? `${datas.borderSize}rpx solid ${datas.borderColor}` : 'none'
                    }"
                >
                    <view class="search-left">
                        <snake-icon name="search" size="44rpx" :color="datas.textColor"></snake-icon>
                        <!-- 占位符 -->
                        <view v-if="!datas.textList.length" class="input-search" @click="toPage(datas.url)">
                            <input
                                v-if="datas.isSearch"
                                class="input"
                                :type="datas.inputType"
                                :disabled="!datas.isSearch"
                                :placeholder="datas.searchText"
                                @confirm="confirm"
                            />
                            <text class="text" v-else :style="{ color: datas.textColor }">{{ datas.searchText }}</text>
                        </view>
                        <!-- 热词竖向滚动 -->
                        <view :style="{ width: hotordsWidth + 'px' }" v-else>
                            <snake-notice-bar
                                :datas="datas"
                                direction="column"
                                :icon="null"
                                :text="hotordsList"
                                :bgColor="datas.borderBgColor"
                                :color="datas.textColor"
                                :duration="3000"
                                :customStyle="{ padding: '9rpx 12rpx' }"
                                @click="hotordsClick"
                            ></snake-notice-bar>
                        </view>
                    </view>
                    <view
                        class="search-right"
                        :style="{ paddingRight: datas.rightImage.marginRight + 'rpx' }"
                        v-if="datas.rightImage.show"
                    >
                        <image
                            class="search-right-image"
                            :src="datas.rightImage.src"
                            :style="{
                                borderRadius: datas.rightImage.borderRadius + 'rpx',
                                width: datas.rightImage.width + 'rpx',
                                height: datas.rightImage.height + 'rpx'
                            }"
                        />
                    </view>
                </view>
                <!-- 右侧icon图片 最多两个 -->
                <template v-if="datas.iconImgList.length !== 0">
                    <view
                        :id="item.id"
                        class="right"
                        v-for="(item, index) in datas.iconImgList"
                        :key="index"
                        @click="uni.$snake.navTo(item.url)"
                    >
                        <image
                            class="right-image"
                            :src="item.src"
                            :style="{ width: item.width + 'rpx', height: item.height + 'rpx' }"
                        />
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
/**
 * @component CommoditySearch
 * @description 提供可吸顶的商城搜索栏，支持输入搜索、热词轮播、右侧图片和快捷图标。
 */

import { getCurrentInstance } from 'vue';
export default {
    name: 'commoditysearch',
    options: { virtualHost: true, styleIsolation: 'shared' },
    props: { datas: Object },
    emits: ['search'],
    setup() {
        const instance = getCurrentInstance();
        return { instance };
    },
    data() {
        return {
            hotordsWidth: 0, // 热词滚动的宽度
            height: 0 // 容器高度
        };
    },
    computed: {
        // 热词列表
        hotordsList() {
            let list = [];
            if (this.datas.textList.length) {
                list = this.datas.textList.map(item => item.text);
            }
            return list;
        }
    },
    async mounted() {
        await uni.$snake.sleep(100);
        if (this.datas.position === 1) {
            // 组件吸顶 获取占位的高度
            uni.$snake.getRect('.search-fixed', this.instance).then(size => {
                this.height = `${size.height}px`;
            });
        } else {
            this.height = 'auto';
        }
        // 获取搜索框的占位文本，用于热词滚动的宽度
        this.hotordsWidth = (await uni.$snake.getRect('.search-left', this.instance)).width;
        if (this.datas.rightImage.show) {
            this.hotordsWidth -= (await uni.$snake.getRect('.search-right', this.instance)).width;
        }
    },
    methods: {
        // 点击热词跳转
        hotordsClick(index) {
            uni.$snake.navTo(this.datas.textList[index].url);
        },
        toPage() {
            // 如果可以回车搜索 则不能跳转
            if (this.datas.isSearch) {
                return false;
            }
            uni.$snake.navTo(this.datas.url);
        },
        confirm(e) {
            const keyword = e.detail.value;
            this.$emit('search', keyword);
            if (this.datas.url) uni.$snake.navTo(this.datas.url + keyword);
        }
    }
};
</script>

<style scoped lang="scss">
.search-fixed {
    position: fixed;
    /* #ifndef MP-WEIXIN */
    top: 0;
    /* #endif */
    /* #ifdef H5 */
    top: 44px;
    /* #endif */
    left: 50%;
    z-index: 9;
    box-sizing: border-box;
    width: 100%;
    transform: translateX(-50%);
}

.search {
    display: flex;
    flex: 1;
    align-items: center;

    /* 搜索框 */
    .center {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-left: 20rpx;
        overflow: hidden;
        font-size: 24rpx;

        .search-left {
            display: flex;
            flex: 1;
            align-items: center;

            text:nth-child(2) {
                width: 100%;
                padding-left: 5rpx;
                overflow: hidden; //超出的文本隐藏
                text-overflow: ellipsis; //用省略号显示
                font-size: 24rpx;
                white-space: nowrap; //不换行
            }

            .input-search {
                width: 100%;
                padding-left: 10rpx;

                .input {
                    width: 100%;
                    font-size: 24rpx;
                }
                .text {
                    font-size: 26rpx;
                }
            }
        }

        .search-right {
            display: flex;
            align-items: center;
            justify-content: center;

            .search-right-image {
                width: 100%;
                height: 100%;
            }
        }
    }

    .right {
        display: flex;
        flex: 1;
        flex-direction: column;

        .right-image {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
