<template>
    <view class="cms-v2-search" :style="rootStyle">
        <view class="cms-v2-search__box" :style="boxStyle" @click="handleBoxClick">
            <text class="cms-v2-search__symbol">⌕</text>
            <input
                class="cms-v2-search__input"
                :type="data.inputType === 'number' ? 'number' : 'text'"
                :placeholder="placeholder"
                :disabled="!data.isSearch"
                :value="keyword"
                @input="handleInput"
                @click.stop
                @confirm="submitSearch"
            />
            <image
                v-if="data.rightImage?.show && data.rightImage?.src"
                class="cms-v2-search__right"
                :src="data.rightImage.src"
                mode="aspectFit"
                :style="rightImageStyle"
                @click.stop="openV2Link(data.rightImage.link, linkService, pageInfo)"
            />
        </view>
        <image
            v-for="(icon, index) in icons"
            :key="index"
            class="cms-v2-search__icon"
            :src="icon.src || ''"
            mode="aspectFit"
            :style="iconStyle(icon)"
            @click="openV2Link(icon.link, linkService, pageInfo)"
        />
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Search @description CMS v2 搜索框内部渲染器。 @see /cms/overview */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const icons = computed(() => (Array.isArray(props.data.icons) ? props.data.icons.slice(0, 2) : []));
const hotwordIndex = ref(0);
const hotwords = computed(() => (Array.isArray(props.data.textList) ? props.data.textList : []));
const placeholder = computed(
    () => hotwords.value[hotwordIndex.value]?.text || props.data.searchText || '请输入搜索内容'
);
const keyword = ref('');
let hotwordTimer: ReturnType<typeof setInterval> | undefined;
const rootStyle = computed(() => ({
    padding: `0 ${rpx(props.data.style?.pageMargin)}`,
    backgroundColor: props.data.style?.backgroundColor || '#f9f9f9'
}));
const boxStyle = computed(() => ({
    height: rpx(props.data.style?.height, 60),
    color: props.data.style?.textColor || '#969799',
    backgroundColor: props.data.style?.borderBgColor || '#fff',
    border:
        props.data.style?.showBorder === false
            ? 'none'
            : `${rpx(props.data.style?.borderSize, 1)} solid ${props.data.style?.borderColor || '#000'}`,
    borderRadius: rpx(props.data.style?.borderRadius)
}));
const rightImageStyle = computed(() => ({
    width: rpx(props.data.rightImage?.width, 60),
    height: rpx(props.data.rightImage?.height, 60),
    borderRadius: rpx(props.data.rightImage?.borderRadius),
    marginRight: rpx(props.data.rightImage?.marginRight)
}));
const iconStyle = (icon: Record<string, any>) => ({ width: rpx(icon.width, 60), height: rpx(icon.height, 60) });
const handleInput = (event: any) => {
    keyword.value = String(event?.detail?.value || '');
};
const handleBoxClick = () => {
    if (!props.data.isSearch) return openV2Link(props.data.link, props.linkService, props.pageInfo);
};
const submitSearch = () => {
    const hotword = hotwords.value[hotwordIndex.value];
    const value = keyword.value.trim() || hotword?.text || '';
    return openV2Link(hotword?.link || props.data.link, props.linkService, props.pageInfo, { keyword: value });
};
onMounted(() => {
    hotwordTimer = setInterval(() => {
        if (!keyword.value && hotwords.value.length > 1)
            hotwordIndex.value = (hotwordIndex.value + 1) % hotwords.value.length;
    }, 3000);
});
onBeforeUnmount(() => clearInterval(hotwordTimer));
</script>
<style scoped>
.cms-v2-search {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    gap: 12rpx;
    width: 100%;
}
.cms-v2-search__box {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    padding: 0 16rpx;
}
.cms-v2-search__input {
    flex: 1;
    min-width: 0;
}
.cms-v2-search__symbol {
    margin-right: 10rpx;
    font-size: 32rpx;
}
.cms-v2-search__icon {
    width: 60rpx;
    height: 60rpx;
}
</style>
