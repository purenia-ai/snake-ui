<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import DemoPage from './DemoPage.vue';
import DemoSection from './DemoSection.vue';
import DemoControlPanel from './DemoControlPanel.vue';
import { createDemoState, getDemoDefinition, localizeDemoDefinition, type DemoValue } from './demo-config';
import { demoText, demoTitle, useDemoLocale } from './demo-i18n';
import {
    activities,
    auxiliaryData,
    cmsComponents,
    couponData,
    filters,
    foundationSwiperData,
    foundationTabs,
    goods,
    hotzoneData,
    imageData,
    jumpAppletData,
    listSwitchingData,
    localImage,
    navigationData,
    noticeData,
    pictureAdsData,
    popupData,
    searchData,
    suspensionData
} from './fixtures';

const props = defineProps<{ kind: string; title: string }>();
const { localeName, text } = useDemoLocale();
const definition = computed(() => {
    localeName.value;
    return localizeDemoDefinition(getDemoDefinition(props.kind), demoText);
});
const localizedTitle = computed(() => {
    localeName.value;
    return demoTitle(props.kind, props.title);
});
const isEnglish = computed(() => localeName.value === 'en-US');
const demoState = reactive<Record<string, DemoValue>>(createDemoState(props.kind));
const currentActivity = ref('001');
const currentTab = ref(0);
const sortValue = ref('');
const popupVisible = ref(false);
const overlayVisible = ref(false);
const transitionVisible = ref(true);
const scrollTop = ref(0);
const formRef = ref<any>();
const formModel = reactive({ name: '', intro: '', fruit: ['apple'], flavor: 'sweet', enabled: true });
const formRules = {
    name: [{ required: true, message: '请输入姓名', trigger: ['change', 'blur'] }],
    intro: [{ min: 5, message: '简介至少输入 5 个字', trigger: 'blur' }]
};
const formMessage = ref('请填写并提交表单');
const inputValue = ref('');
const textareaValue = ref('Snake UI 表单组件');
const checkboxValue = ref(true);
const checkboxValues = ref<unknown[]>(['apple']);
const radioStandalone = ref(false);
const radioValue = ref<unknown>('sweet');
const switchValue = ref(true);
const sliderValue = ref(35);
const viewportKinds = new Set(['snake-cms', 'filter-sorts', 'page-popup', 'suspension', 'overlay', 'popup', 'sticky']);
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
const customModuleData = { slotName: 'campaign' };
const richTextData = computed(() => ({
    myValue: `<h3>${String(demoState.richHeading ?? 'Snake UI')}</h3><p>这是一个可交互的 uni-app 跨端实时预览。</p>`
}));
const videoData = computed(() => ({ src: demoState.videoScene === 'local' ? localImage : '' }));
const cmsPageInfo = { pageId: 'preview' };
const demoCmsComponents = computed(() => (demoState.cmsScene === 'simple' ? cmsComponents.slice(0, 1) : cmsComponents));
const demoImageData = computed(() => ({
    ...imageData,
    platformOptions: imageData.platformOptions.map(item => ({
        ...item,
        imgs: { ...item.imgs, paddingLR: Number(demoState.contentMargin ?? 20) }
    }))
}));
const demoHotzoneData = computed(() => ({
    ...hotzoneData,
    hotzoneList: hotzoneData.hotzoneList.map(zone => ({
        ...zone,
        httpType: Number(demoState.hotzoneLinkType ?? 10)
    }))
}));
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

async function submitForm() {
    try {
        await formRef.value?.validate();
        formMessage.value = `校验通过：${formModel.name}`;
    } catch {
        formMessage.value = '请检查表单中的错误提示';
    }
}

function resetForm() {
    formRef.value?.resetFields();
    formMessage.value = '表单已重置';
}
</script>

<template>
    <DemoPage :title="localizedTitle" :eyebrow="categoryLabel" :desc="previewDescription" :viewport="isViewportPreview">
        <DemoSection :bare="isViewportPreview" variant="preview" :title="text('演示效果')">
            <view v-if="kind === 'button'" class="demo-stack">
                <snake-button
                    :type="String(demoState.type)"
                    :size="demoState.buttonSize as any"
                    :shape="demoState.buttonShape as any"
                    :plain="Boolean(demoState.plain)"
                    :disabled="Boolean(demoState.disabled)"
                    :loading="Boolean(demoState.loading)"
                    :loading-text="isEnglish ? 'Processing' : '处理中'"
                    icon="checkmark"
                    ripple
                    >Snake Button</snake-button
                >
            </view>
            <view v-else-if="kind === 'loading-icon'" class="demo-stack demo-center"
                ><snake-loading-icon
                    :mode="demoState.loadingMode as any"
                    :size="Number(demoState.loadingSize)"
                    :vertical="Boolean(demoState.loadingVertical)"
                    :text="isEnglish ? 'Loading' : '加载中'"
            /></view>
            <view v-else-if="kind === 'transition'" class="demo-stack"
                ><snake-button size="small" @click="transitionVisible = !transitionVisible">{{
                    isEnglish ? 'Toggle' : '切换显示'
                }}</snake-button
                ><snake-transition
                    :show="transitionVisible"
                    :name="demoState.transitionName as any"
                    :duration="Number(demoState.transitionDuration)"
                    ><view class="demo-transition-card">Snake Transition</view></snake-transition
                ></view
            >
            <view v-else-if="kind === 'empty'" class="demo-center"
                ><snake-empty
                    :mode="String(demoState.emptyMode)"
                    :icon="demoState.showIcon ? localImage : ''"
                    :icon-size="Number(demoState.emptyIconSize)"
                    :text="String(demoState.text)"
                    :text-color="String(demoState.textColor)"
            /></view>
            <view v-else-if="kind === 'icon'" class="demo-icons"
                ><view
                    v-for="name in [
                        'search',
                        'close',
                        'checkmark',
                        'warning',
                        'star-fill',
                        'heart-fill',
                        'setting',
                        'play-right-fill'
                    ]"
                    :key="name"
                    class="demo-icon-item"
                    ><snake-icon
                        :name="name"
                        :color="String(demoState.iconColor)"
                        :size="Number(demoState.iconSize)"
                    /><text>{{ name }}</text></view
                ></view
            >
            <view v-else-if="kind === 'image'" class="demo-stack"
                ><snake-image
                    :src="localImage"
                    width="100%"
                    height="320rpx"
                    :radius="Number(demoState.radius)"
                    :mode="String(demoState.imageMode)" /><snake-image
                    src="/static/not-found.png"
                    width="100%"
                    height="180rpx"
                    :radius="Number(demoState.radius)"
            /></view>
            <view v-else-if="kind === 'lazy-image'" class="demo-stack"
                ><view class="demo-image-box"
                    ><snake-lazy-image
                        :src="demoState.lazySource === 'error' ? '/static/not-found.png' : localImage" /></view
            ></view>
            <view v-else-if="kind === 'loadmore'" class="demo-stack"
                ><snake-loadmore
                    :status="String(demoState.loadStatus)"
                    :icon-type="String(demoState.loadIcon)"
                    :is-dot="Boolean(demoState.loadDot)"
            /></view>
            <view v-else-if="kind === 'notice-bar'" class="demo-stack"
                ><snake-notice-bar
                    :volume-icon="Boolean(demoState.noticeIcon)"
                    :more-icon="Boolean(demoState.noticeMore)"
                    :mode="demoState.noticeMode === 'vertical' ? 'vertical' : 'horizontal'"
                    :direction="demoState.noticeMode === 'vertical' ? 'column' : 'row'"
                    :text="
                        demoState.noticeMode === 'vertical'
                            ? ''
                            : isEnglish
                              ? 'Welcome to Snake UI'
                              : '欢迎使用 Snake UI'
                    "
                    :list="
                        isEnglish
                            ? ['Foundation components are ready', 'Supports H5, mini programs and apps']
                            : ['基础组件已就绪', '支持 H5、小程序和 App']
                    "
                    :duration="Number(demoState.noticeDuration)"
            /></view>
            <view v-else-if="kind === 'overlay'" class="demo-trigger"
                ><snake-button @click="overlayVisible = true">{{
                    isEnglish ? 'Open overlay' : '打开遮罩'
                }}</snake-button
                ><snake-overlay v-model="overlayVisible"
                    ><view class="demo-overlay-tip">{{ demoState.overlayTip }}</view></snake-overlay
                ></view
            >
            <view v-else-if="kind === 'popup'" class="demo-trigger"
                ><snake-button @click="popupVisible = true">{{ isEnglish ? 'Open popup' : '打开弹窗' }}</snake-button
                ><snake-popup
                    v-model="popupVisible"
                    :mode="demoState.popupMode as any"
                    :close-on-click-overlay="Boolean(demoState.closeOverlay)"
                    ><view class="demo-popup"
                        ><text class="demo-popup__title">Snake Popup</text
                        ><text>{{ isEnglish ? 'This is an interactive popup.' : '这是一个可交互的弹出层。' }}</text
                        ><snake-button custom-style="margin-top: 32rpx" @click="popupVisible = false">{{
                            isEnglish ? 'Close' : '关闭'
                        }}</snake-button></view
                    ></snake-popup
                ></view
            >
            <view v-else-if="kind === 'sticky'" class="demo-scroll"
                ><view class="demo-scroll-hero">{{
                    isEnglish ? 'Scroll down to see the sticky behavior' : '向下滚动查看吸顶效果'
                }}</view
                ><snake-sticky
                    bg-color="#06D290"
                    :disabled="Boolean(demoState.stickyDisabled)"
                    :offset-top="Number(demoState.stickyOffset)"
                    ><view class="demo-sticky">{{
                        isEnglish ? 'I stay at the top of the preview' : '我会固定在手机预览顶部'
                    }}</view></snake-sticky
                ><view v-for="item in 12" :key="item" class="demo-row"
                    >{{ isEnglish ? 'Scroll item' : '滚动内容' }} {{ item }}</view
                ></view
            >
            <view v-else-if="kind === 'swiper'" class="demo-stack"
                ><snake-swiper
                    :list="foundationSwiperData"
                    :height="Number(demoState.swiperHeight)"
                    :radius="Number(demoState.radius)"
                    :indicator="Boolean(demoState.swiperIndicator)"
                    :indicator-mode="String(demoState.swiperMode)"
                    :effect3d="Boolean(demoState.swiperEffect3d)"
                    :show-title="Boolean(demoState.swiperTitle)"
                    :autoplay="Boolean(demoState.swiperAutoplay)"
            /></view>
            <view v-else-if="kind === 'tabs'" class="demo-stack"
                ><snake-tabs
                    :list="foundationTabs"
                    :current="currentTab"
                    :scrollable="Boolean(demoState.tabsScrollable)"
                    :line-color="String(demoState.tabsColor)"
                    :active-color="String(demoState.tabsColor)"
                    :font-size="Number(demoState.tabsSize)"
                    @change="currentTab = $event"
                /><view class="demo-tab-content"
                    >{{ isEnglish ? 'Selected: ' : '当前选中：' }}{{ foundationTabs[currentTab] }}</view
                ></view
            >
            <view v-else-if="kind === 'subsection'" class="demo-stack"
                ><snake-subsection
                    :list="isEnglish ? ['Pending payment', 'To ship', 'To receive'] : ['待付款', '待发货', '待收货']"
                    :current="Number(demoState.subsectionCurrent)"
                    :mode="demoState.subsectionMode as any"
                    :bold="Boolean(demoState.subsectionBold)"
                    :animation="Boolean(demoState.subsectionAnimation)"
                    @change="demoState.subsectionCurrent = $event"
            /></view>
            <view v-else-if="kind === 'button-sort'" class="demo-stack"
                ><snake-button-sort :title="String(demoState.sortTitle)" @change="sortValue = $event.value" /><view
                    class="demo-tab-content"
                    >{{ isEnglish ? 'Current state: ' : '当前状态：'
                    }}{{ sortValue || (isEnglish ? 'Default' : '默认') }}</view
                ></view
            >
            <view v-else-if="kind === 'drop-menu' || kind === 'drop-menu-item'" class="demo-menu"
                ><snake-drop-menu
                    ><snake-drop-menu-item :title="String(demoState.menuTitle)"
                        ><view class="demo-menu-panel">{{
                            isEnglish
                                ? 'Place filters or other business content here'
                                : '这里可以放筛选项或其他业务内容'
                        }}</view></snake-drop-menu-item
                    ><snake-drop-menu-item :title="isEnglish ? 'Sort by' : '排序方式'"
                        ><view class="demo-menu-panel">{{
                            isEnglish ? 'Recommended · Latest · Price' : '综合排序 · 最新发布 · 价格优先'
                        }}</view></snake-drop-menu-item
                    ></snake-drop-menu
                ></view
            >
            <view v-else-if="kind === 'index-list' || kind === 'index-anchor'" class="demo-index"
                ><snake-index-list
                    :index-list="['A', 'B', 'C', 'D']"
                    :active-color="String(demoState.indexColor || '#06D290')"
                    ><view v-for="letter in ['A', 'B', 'C', 'D']" :key="letter"
                        ><snake-index-anchor
                            :index="letter"
                            :text="kind === 'index-anchor' ? `${String(demoState.anchorPrefix)} ${letter}` : letter"
                            custom-style="height: 64rpx; padding: 0 20rpx"
                        /><view v-for="item in 3" :key="item" class="demo-index-row"
                            >{{ letter }} {{ isEnglish ? 'item' : '类内容' }} {{ item }}</view
                        ></view
                    ></snake-index-list
                ></view
            >
            <view v-else-if="kind === 'form' || kind === 'form-item'" class="demo-form">
                <snake-form
                    ref="formRef"
                    :model="formModel"
                    :rules="formRules"
                    :border-bottom="Boolean(demoState.formBorder)"
                    :label-position="demoState.formTopLabel ? 'top' : 'left'"
                >
                    <snake-form-item
                        :label="isEnglish ? 'Name' : '姓名'"
                        prop="name"
                        :required="Boolean(demoState.formRequired ?? true)"
                        left-icon="info"
                        ><snake-input
                            v-model="formModel.name"
                            :placeholder="isEnglish ? 'Enter your name' : '请输入姓名'"
                            clearable
                    /></snake-form-item>
                    <snake-form-item :label="isEnglish ? 'Bio' : '简介'" prop="intro"
                        ><snake-textarea v-model="formModel.intro" :maxlength="60" count height="150"
                    /></snake-form-item>
                    <snake-form-item :label="isEnglish ? 'Fruit' : '水果'" prop="fruit"
                        ><snake-checkbox-group v-model="formModel.fruit"
                            ><snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox
                            ><snake-checkbox name="pear">{{
                                isEnglish ? 'Pear' : '雪梨'
                            }}</snake-checkbox></snake-checkbox-group
                        ></snake-form-item
                    >
                    <snake-form-item :label="isEnglish ? 'Flavor' : '味道'" prop="flavor"
                        ><snake-radio-group v-model="formModel.flavor"
                            ><snake-radio name="sweet">{{ isEnglish ? 'Sweet' : '鲜甜' }}</snake-radio
                            ><snake-radio name="spicy">{{
                                isEnglish ? 'Spicy' : '香辣'
                            }}</snake-radio></snake-radio-group
                        ></snake-form-item
                    >
                    <snake-form-item :label="isEnglish ? 'Enabled' : '启用'" prop="enabled"
                        ><snake-switch v-model="formModel.enabled"
                    /></snake-form-item>
                </snake-form>
                <view class="demo-form__actions"
                    ><snake-button size="small" @click="submitForm">{{
                        isEnglish ? 'Validate' : '提交校验'
                    }}</snake-button
                    ><snake-button size="small" plain @click="resetForm">{{
                        isEnglish ? 'Reset' : '重置'
                    }}</snake-button></view
                >
                <text class="demo-form__message">{{ formMessage }}</text>
            </view>
            <view v-else-if="kind === 'input'" class="demo-control-stack"
                ><snake-input
                    v-model="inputValue"
                    border="surround"
                    prefix-icon="search"
                    :clearable="Boolean(demoState.inputClearable)"
                    :disabled="Boolean(demoState.inputDisabled)"
                    :placeholder="String(demoState.inputPlaceholder)"
                /><snake-input
                    v-model="inputValue"
                    type="password"
                    border="surround"
                    show-password
                    :placeholder="isEnglish ? 'Password' : '密码输入'"
                /><text
                    >{{ isEnglish ? 'Current value: ' : '当前值：'
                    }}{{ inputValue || (isEnglish ? 'Empty' : '空') }}</text
                ></view
            >
            <view v-else-if="kind === 'textarea'" class="demo-control-stack"
                ><snake-textarea
                    v-model="textareaValue"
                    :count="Boolean(demoState.textareaCount)"
                    :auto-height="Boolean(demoState.textareaAuto)"
                    :maxlength="80"
                /><text>{{
                    isEnglish ? `${textareaValue.length} characters` : `已输入 ${textareaValue.length} 个字`
                }}</text></view
            >
            <view v-else-if="kind === 'checkbox'" class="demo-control-stack"
                ><snake-checkbox v-model="checkboxValue" :disabled="Boolean(demoState.choiceDisabled)">{{
                    isEnglish ? 'Accept the user agreement' : '同意用户协议'
                }}</snake-checkbox
                ><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ checkboxValue }}</text></view
            >
            <view v-else-if="kind === 'checkbox-group'" class="demo-control-stack"
                ><snake-checkbox-group
                    v-model="checkboxValues"
                    :placement="demoState.choiceColumn ? 'column' : 'row'"
                    :max="2"
                    ><snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox
                    ><snake-checkbox name="pear">{{ isEnglish ? 'Pear' : '雪梨' }}</snake-checkbox
                    ><snake-checkbox name="lemon">{{
                        isEnglish ? 'Lemon' : '柠檬'
                    }}</snake-checkbox></snake-checkbox-group
                ><text
                    >{{ isEnglish ? 'Selected: ' : '已选：'
                    }}{{ checkboxValues.join(isEnglish ? ', ' : '、') || (isEnglish ? 'None' : '无') }}</text
                ></view
            >
            <view v-else-if="kind === 'radio'" class="demo-control-stack"
                ><snake-radio v-model="radioStandalone" :disabled="Boolean(demoState.choiceDisabled)">{{
                    isEnglish ? 'Default address' : '默认地址'
                }}</snake-radio
                ><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ radioStandalone }}</text></view
            >
            <view v-else-if="kind === 'radio-group'" class="demo-control-stack"
                ><snake-radio-group v-model="radioValue" :placement="demoState.choiceColumn ? 'column' : 'row'"
                    ><snake-radio name="sweet">{{ isEnglish ? 'Sweet' : '鲜甜' }}</snake-radio
                    ><snake-radio name="spicy">{{ isEnglish ? 'Spicy' : '香辣' }}</snake-radio
                    ><snake-radio name="mild">{{ isEnglish ? 'Mild' : '清淡' }}</snake-radio></snake-radio-group
                ><text>{{ isEnglish ? 'Selected: ' : '已选：' }}{{ radioValue }}</text></view
            >
            <view v-else-if="kind === 'switch'" class="demo-control-stack"
                ><snake-switch
                    v-model="switchValue"
                    :loading="Boolean(demoState.switchLoading)"
                    :disabled="Boolean(demoState.switchDisabled)"
                /><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ switchValue }}</text></view
            >
            <view v-else-if="kind === 'slider'" class="demo-control-stack"
                ><snake-slider
                    v-model="sliderValue"
                    :step="Number(demoState.sliderStep)"
                    :show-value="Boolean(demoState.sliderShowValue)"
                    :disabled="Boolean(demoState.sliderDisabled)"
                    show-edge-value
                /><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ sliderValue }}</text></view
            >
            <snake-cms
                v-if="kind === 'snake-cms'"
                :page-info="cmsPageInfo"
                :page-components="demoCmsComponents"
                :scroll-top="scrollTop"
            />
            <snake-custom-module v-else-if="kind === 'custom-module'" :datas="customModuleData"
                ><view class="custom-card">{{ demoState.moduleText }}</view></snake-custom-module
            >
            <snake-images v-else-if="kind === 'images'" :datas="demoImageData" />
            <snake-hotzone v-else-if="kind === 'hotzone'" :datas="demoHotzoneData" />
            <snake-picture-ads v-else-if="kind === 'picture-ads'" :datas="demoPictureAdsData" />
            <snake-magic-cube v-else-if="kind === 'magic-cube'" :datas="magicCubeData" />
            <snake-videos v-else-if="kind === 'videos'" :datas="videoData" />
            <snake-rich-text v-else-if="kind === 'rich-text'" :datas="richTextData" />
            <snake-notice v-else-if="kind === 'notice'" :datas="demoNoticeData" />
            <snake-auxiliary-segmentation v-else-if="kind === 'auxiliary-segmentation'" :datas="demoAuxiliaryData" />
            <snake-graphic-navigation v-else-if="kind === 'graphic-navigation'" :datas="demoNavigationData" />
            <snake-commodity-search v-else-if="kind === 'commodity-search'" :datas="demoSearchData" />
            <snake-suspension v-else-if="kind === 'suspension'" :datas="demoSuspensionData" :scroll-top="scrollTop" />
            <snake-page-popup v-else-if="kind === 'page-popup'" :datas="demoPopupData" />
            <snake-jump-applet v-else-if="kind === 'jump-applet'" :datas="demoJumpAppletData" />
            <view
                v-else-if="kind === 'follow'"
                :class="['demo-follow', { 'demo-follow--strong': demoState.followScene === 'strong' }]"
                ><snake-follow
            /></view>
            <snake-goods-list
                v-else-if="kind === 'goods-list'"
                :goods-list="goods"
                :list-type="String(demoState.goodsMode)"
                :commodity-type="0"
                :page-margin="Number(demoState.goodsMargin)"
                :image-margin="10"
            />
            <snake-activity-list
                v-else-if="kind === 'activity-list'"
                :list="demoActivities"
                :current="currentActivity"
                @change="selectActivity"
            />
            <snake-filter-sorts
                v-else-if="kind === 'filter-sorts'"
                :filters="filters"
                sort="auto"
                :bg-color="String(demoState.filterBg)"
                :show-tabs="Boolean(demoState.filterTabs)"
                :scroll-top="scrollTop"
            />
            <snake-list-switching v-else-if="kind === 'list-switching'" :datas="demoListSwitchingData" />
            <snake-coupon v-else-if="kind === 'coupon'" :datas="demoCouponData" />
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
.demo-icons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
}
.demo-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    padding: 28rpx 12rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}
.demo-image-box {
    width: 100%;
    height: 300rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-transition-card {
    display: flex;
    min-height: 220rpx;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    color: #fff;
    background: linear-gradient(135deg, var(--snake-color-primary-deep), var(--snake-color-primary-deeper));
}
.demo-trigger {
    padding: 48rpx 24rpx;
}
.demo-overlay-tip {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #fff;
}
.demo-popup {
    padding: 40rpx 32rpx calc(40rpx + env(safe-area-inset-bottom));
    color: var(--snake-color-text-secondary);
}
.demo-popup__title {
    display: block;
    margin-bottom: 16rpx;
    color: var(--snake-color-text);
    font-size: 34rpx;
    font-weight: 700;
}
.demo-scroll {
    min-height: 150vh;
    background: var(--snake-color-surface-muted);
}
.demo-scroll-hero {
    display: flex;
    height: 360rpx;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-secondary);
}
.demo-sticky {
    padding: 24rpx;
    color: #fff;
    text-align: center;
}
.demo-row {
    margin: 20rpx 24rpx;
    padding: 32rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 14rpx;
    background: var(--snake-color-surface);
    box-shadow: 0 6rpx 18rpx rgba(16, 84, 56, 0.04);
}
.demo-tab-content {
    padding: 64rpx 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
    color: var(--snake-demo-accent-text);
    text-align: center;
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
.demo-menu {
    min-height: 320rpx;
    padding: 28rpx 0;
}
.demo-menu :deep(.snake-drop-menu) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.demo-menu-panel {
    padding: 48rpx 28rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
.demo-index {
    height: 620rpx;
}
.demo-index-row {
    padding: 28rpx 20rpx;
    border-bottom: 1rpx solid var(--snake-color-divider);
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
.demo-form,
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
    padding: 24rpx;
}
.demo-form {
    gap: 20rpx;
}
.demo-form__actions {
    display: flex;
    gap: 20rpx;
    padding-top: 12rpx;
}
.demo-form__message,
.demo-control-stack > text {
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}

.custom-card {
    margin: 0 24rpx;
    padding: 48rpx 28rpx;
    border-radius: 20rpx;
    color: #eafff4;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
    font-weight: 700;
}
</style>
