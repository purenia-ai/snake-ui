<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import DemoControlPanel from '../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../components/demo-page/demo-page.vue';
import DemoSection from '../components/demo-section/demo-section.vue';
import { createDemoState, getDemoDefinition, localizeDemoDefinition, type DemoValue } from './demo-config';
import { demoText, demoTitle, useDemoLocale } from '../common/demo-i18n';
import {
    activities,
    auxiliaryData,
    cmsComponents,
    couponData,
    filters,
    goods,
    jumpAppletData,
    listSwitchingData,
    localImage,
    navigationData,
    noticeData,
    pictureAdsData,
    popupData,
    searchData,
    suspensionData
} from '../common/fixtures';

const props = defineProps<{ kind: string; title: string }>();
const { localeName, text } = useDemoLocale();
const definition = computed(() => {
    const _locale = localeName.value;
    return localizeDemoDefinition(getDemoDefinition(props.kind), demoText);
});
const localizedTitle = computed(() => {
    const _locale = localeName.value;
    return demoTitle(props.kind, props.title);
});
const demoState = reactive<Record<string, DemoValue>>(createDemoState(props.kind));
const currentActivity = ref('001');
const scrollTop = ref(0);
const viewportKinds = new Set(['snake-cms', 'filter-sorts', 'page-popup', 'suspension']);
const isViewportPreview = computed(() => viewportKinds.has(props.kind));
const categoryLabel = computed(() => definition.value.category);
const previewDescription = computed(() => definition.value.description);
const magicCubeData = computed(() => ({
    rubiksCubeType: 1,
    heights: 360,
    pageMargin: 20,
    imgMargin: Number(demoState.cubeMargin ?? 8),
    borderRadius: Number(demoState.cubeRadius ?? 12),
    bgColor: '#ffffff',
    imageTypeObj: { imageList: [{ src: localImage, url: '' }] }
}));
const richTextData = computed(() => ({
    myValue: `<h3>${String(demoState.richHeading ?? 'Snake UI')}</h3><p>这是一个可交互的 uni-app 跨端实时预览。</p>`
}));
const videoData = computed(() => ({ src: demoState.videoScene === 'local' ? localImage : '' }));
const cmsPageInfo = { pageId: 'preview' };
const demoCmsComponents = computed(() => (demoState.cmsScene === 'simple' ? cmsComponents.slice(0, 1) : cmsComponents));
const demoPictureAdsData = computed(() => ({
    ...pictureAdsData,
    borderRadius: Number(demoState.adRadius ?? 16),
    interval: Number(demoState.adInterval ?? 3000)
}));
const demoNoticeData = computed(() => ({
    ...noticeData,
    direction: String(demoState.noticeDirection ?? 'column'),
    isLeftIcon: Boolean(demoState.noticeCmsIcon ?? true)
}));
const demoAuxiliaryData = computed(() => ({ ...auxiliaryData, blankHeight: Number(demoState.segmentHeight ?? 32) }));
const demoNavigationData = computed(() => ({
    ...navigationData,
    borderRadius: Number(demoState.navRadius ?? 16),
    textColor: String(demoState.navTextColor ?? '#24342c')
}));
const demoSearchData = computed(() => ({
    ...searchData,
    searchText: String(demoState.searchPlaceholder ?? '搜索 Snake UI 组件'),
    borderRadius: Number(demoState.searchRadius ?? 36)
}));
const demoSuspensionData = computed(() => ({
    ...suspensionData,
    width: Number(demoState.suspensionSize ?? 96),
    height: Number(demoState.suspensionSize ?? 96)
}));
const demoPopupData = computed(() => ({ ...popupData, popupMode: String(demoState.pagePopupMode ?? 'center') }));
const demoJumpAppletData = computed(() => ({
    ...jumpAppletData,
    title: String(demoState.appletTitle ?? '打开小程序'),
    btnColor: String(demoState.appletColor ?? '#06D290')
}));
const demoActivities = computed(() => (demoState.activityScene === 'single' ? activities.slice(0, 1) : activities));
const demoListSwitchingData = computed(() => ({
    ...listSwitchingData,
    commoditylisttype: Number(demoState.listLayout ?? 0),
    borderRadius: Number(demoState.listRadius ?? 12)
}));
const demoCouponData = computed(() => ({
    ...couponData,
    modeType: String(demoState.couponMode ?? 'page'),
    popupMode: 'bottom'
}));

watch(
    () => props.kind,
    kind => {
        for (const key of Object.keys(demoState)) delete demoState[key];
        Object.assign(demoState, createDemoState(kind));
    }
);

function updateDemoValue(key: string, value: DemoValue) {
    demoState[key] = value;
}

function selectActivity(item: { id: string }) {
    currentActivity.value = item.id;
}
</script>

<template>
    <DemoPage :title="localizedTitle" :eyebrow="categoryLabel" :desc="previewDescription" :viewport="isViewportPreview">
        <DemoSection :bare="isViewportPreview" variant="preview" :title="text('演示效果')">
            <snake-cms
                v-if="kind === 'snake-cms'"
                class="demo-snake-cms-showcase"
                :page-info="cmsPageInfo"
                :page-components="demoCmsComponents"
                :scroll-top="scrollTop"
            />
            <snake-picture-ads
                v-else-if="kind === 'picture-ads'"
                class="demo-picture-ads-showcase"
                :datas="demoPictureAdsData"
            />
            <snake-magic-cube
                v-else-if="kind === 'magic-cube'"
                class="demo-magic-cube-showcase"
                :datas="magicCubeData"
            />
            <snake-videos v-else-if="kind === 'videos'" class="demo-videos-showcase" :datas="videoData" />
            <snake-rich-text v-else-if="kind === 'rich-text'" class="demo-rich-text-showcase" :datas="richTextData" />
            <snake-notice v-else-if="kind === 'notice'" class="demo-notice-showcase" :datas="demoNoticeData" />
            <snake-auxiliary-segmentation
                v-else-if="kind === 'auxiliary-segmentation'"
                class="demo-auxiliary-segmentation-showcase"
                :datas="demoAuxiliaryData"
            />
            <snake-graphic-navigation
                v-else-if="kind === 'graphic-navigation'"
                class="demo-graphic-navigation-showcase"
                :datas="demoNavigationData"
            />
            <snake-commodity-search
                v-else-if="kind === 'commodity-search'"
                class="demo-commodity-search-showcase"
                :datas="demoSearchData"
            />
            <snake-suspension
                v-else-if="kind === 'suspension'"
                class="demo-suspension-showcase"
                :datas="demoSuspensionData"
                :scroll-top="scrollTop"
            />
            <snake-page-popup
                v-else-if="kind === 'page-popup'"
                class="demo-page-popup-showcase"
                :datas="demoPopupData"
            />
            <snake-jump-applet
                v-else-if="kind === 'jump-applet'"
                class="demo-jump-applet-showcase"
                :datas="demoJumpAppletData"
            />
            <view
                v-else-if="kind === 'follow'"
                :class="[
                    'demo-follow',
                    'demo-follow-showcase',
                    { 'demo-follow--strong': demoState.followScene === 'strong' }
                ]"
                ><snake-follow
            /></view>
            <snake-goods-list
                v-else-if="kind === 'goods-list'"
                class="demo-goods-list-showcase"
                :goods-list="goods"
                :list-type="String(demoState.goodsMode)"
                :commodity-type="0"
                :page-margin="Number(demoState.goodsMargin)"
                :image-margin="10"
            />
            <snake-activity-list
                v-else-if="kind === 'activity-list'"
                class="demo-activity-list-showcase"
                :list="demoActivities"
                :current="currentActivity"
                @change="selectActivity"
            />
            <snake-filter-sorts
                v-else-if="kind === 'filter-sorts'"
                class="demo-filter-sorts-showcase"
                :filters="filters"
                sort="auto"
                :bg-color="String(demoState.filterBg)"
                :show-tabs="Boolean(demoState.filterTabs)"
                :scroll-top="scrollTop"
            />
            <snake-list-switching
                v-else-if="kind === 'list-switching'"
                class="demo-list-switching-showcase"
                :datas="demoListSwitchingData"
            />
            <snake-coupon v-else-if="kind === 'coupon'" class="demo-coupon-showcase" :datas="demoCouponData" />
        </DemoSection>
        <DemoSection v-if="definition.controls.length" variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="definition.controls" :values="demoState" @change="updateDemoValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-center {
    display: flex;
    min-height: 50vh;
    align-items: center;
    justify-content: center;
}
.demo-follow {
    padding: 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-follow--strong {
    border: 2rpx solid var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
</style>
