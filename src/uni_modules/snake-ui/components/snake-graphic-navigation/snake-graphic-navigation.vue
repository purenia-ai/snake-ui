<template>
    <view v-if="imageList.length" class="graphicnavigation">
        <!-- 鍥哄畾鍒楄〃 -->
        <block v-if="datas.imgStyle === 0">
            <view class="defaultNavigation" :style="{ backgroundColor: datas.backgroundColor, flexWrap: 'wrap' }">
                <view
                    class="navigationList__item"
                    v-for="(item, index) in imageList"
                    :key="index"
                    :style="{ padding: ` 0 ${datas.imgMargin}rpx`, width: 100 / imageList.length + '%' }"
                    @click="uni.$snake.navTo(item.url)"
                >
                    <image
                        class="image-warp"
                        :src="item.src"
                        :style="{ borderRadius: pxToRpx(datas.borderRadius) }"
                        mode="widthFix"
                        v-if="datas.navigationType === 0"
                    ></image>
                    <text class="text" :style="[textStyle]" v-if="item.text">{{ item.text }}</text>
                </view>
            </view>
        </block>
        <!-- 妯悜婊戝姩鍒楄〃 -->
        <block v-if="datas.imgStyle === 1">
            <view
                class="scrollList-box"
                :style="{
                    backgroundColor: datas.backgroundColor
                }"
            >
                <!-- <snake-scroll-list
          :indicatorWidth="50"
          :indicatorBarWidth="25"
          :indicator="datas.showSlider && datas.imageList.length > datas.showSize"
          indicatorColor="var(--snake-color-border, #cccccc)"
          indicatorActiveColor="var(--snake-color-text, #606266)">
          <view class="scroll-list">
            <view class="scroll-list__line" v-for="(scrollItem, scrollIndex) in scrollList" :key="scrollIndex">
              <view
                class="scroll-list__line__item"
                v-for="(item, index) in scrollItem.data"
                :key="index"
                :class="[index === item.length - 1 && 'scroll-list__line__item--no-margin-right']"
                :style="{
                  minWidth: 100 / datas.showSize + '%',
                }">
                <image class="scroll-list__line__item__image" :src="item.src" mode="widthFix"></image>
                <text class="scroll-list__line__item__text">{{ item.text }}</text>
              </view>
            </view>
          </view>
        </snake-scroll-list> -->
            </view>
        </block>
    </view>
</template>

<script>
/**
 * @component SnakeGraphicNavigation
 * @description 使用图片与文字组成入口导航，并根据小程序审核状态过滤特定入口。
 * @see /components/graphic-navigation
 */

import { pxToRpx } from '../../libs/function/unit';

export default {
    name: 'snake-graphic-navigation',
    options: { virtualHost: true, styleIsolation: 'shared' },
    props: { datas: Object },
    data() {
        return {};
    },
    methods: {
        pxToRpx
    },
    computed: {
        imageList() {
            return this.datas?.imageList || [];
        },
        // 鏂囧瓧鏍峰紡
        textStyle() {
            const style = {};
            style.color = this.datas.textColor;
            style.fontSize = pxToRpx(this.datas.textSize);
            style.lineHeight = `${this.datas.textHeight}px`;
            return style;
        },
        // 妯悜婊戝姩鍒楄〃
        scrollList() {
            // 鎷疯礉鍘熸暟缁?闃叉splice鏂规硶褰卞搷浜嗗師鏁扮粍
            const copyList = [...this.datas.imageList];
            const list = [];
            if (this.datas.imageList.length <= 5) {
                list.push({ data: this.datas.imageList });
            } else {
                // 鏁扮粍闀垮害澶т簬绛変簬20骞崇瓑鍒?浠斤紝鍚﹀垯鍒嗘垚涓や唤
                const row = 2;
                // if (this.datas.imageList.length >= 20) {
                // 	row = 3
                // }
                const middleIndex = Math.ceil(this.datas.imageList.length / row);
                list.push({ data: copyList.splice(0, middleIndex) });
                list.push({ data: copyList.splice(-middleIndex) });
                // if (row == 3) {
                // 	list.push({ data: copyList })
                // }
            }
            return list;
        }
    }
};
</script>

<style scoped lang="scss">
.graphicnavigation {
    width: 100%;

    .defaultNavigation {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }

    .navigationList__item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;

        .image-warp {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }

        .text {
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
        }
    }
}

// 妯悜婊戝姩鍒楄〃
.scrollList-box {
    box-sizing: border-box;
    width: 100%;
}

.scroll-list {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__line {
        display: flex;
        margin-top: 10px;

        &__item {
            text-align: center;
            // display: flex;
            // align-items: center;
            // flex-direction: column;
            // margin-right: 15px;

            &__image {
                width: 61px;
                height: 48px;
            }

            &__text {
                // text-align: center;
                display: flex;
                justify-content: center;
                font-size: 12px;
                // margin-top: 5px;
                color: var(--snake-color-text-secondary, #666666);
            }

            &--no-margin-right {
                margin-right: 0;
            }
        }
    }
}
</style>
