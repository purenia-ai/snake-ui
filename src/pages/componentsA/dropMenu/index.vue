<template>
    <DemoPage :title="title" :desc="text('下拉菜单容器保证同一时间只展开一个菜单项。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-drop-menu-showcase">
                <snake-drop-menu
                    ref="mainMenuRef"
                    :active-color="String(state.menuActiveColor) || undefined"
                    :height="Number(state.menuHeight)"
                    :title-size="Number(state.menuTitleSize)"
                    :close-on-click-mask="Boolean(state.menuMaskClose)"
                    :close-on-click-self="Boolean(state.menuSelfClose)"
                    :border-bottom="Boolean(state.menuBorderBottom)"
                >
                    <snake-drop-menu-item v-model="category" :options="categoryOptions" />
                    <snake-drop-menu-item :title="text('高级筛选')">
                        <view class="demo-panel">
                            <view class="demo-panel__chips">
                                <view
                                    v-for="chip in chips"
                                    :key="chip.key"
                                    class="demo-panel__chip"
                                    :class="{ 'is-active': chip.active }"
                                    @click="chip.active = !chip.active"
                                >
                                    <text class="demo-panel__chip-label">{{ text(chip.label) }}</text>
                                </view>
                            </view>
                            <snake-button type="primary" @click="closeMainMenu">{{ text('确定') }}</snake-button>
                        </view>
                    </snake-drop-menu-item>
                </snake-drop-menu>
                <text class="demo-variant-sub">{{ text('当前分类') }}：{{ currentCategory }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('标题与状态')">
            <view class="demo-stack">
                <snake-drop-menu>
                    <snake-drop-menu-item v-model="sort" :title="text('排序')" :options="sortOptions" />
                    <snake-drop-menu-item :title="text('禁用项')" disabled :options="categoryOptions" />
                </snake-drop-menu>
                <text class="demo-variant-sub">{{
                    text('传了 title 就固定显示它，选中项记在面板里；disabled 的标题栏置灰且不可点')
                }}</text>
                <text class="demo-variant-sub">{{ text('当前排序') }}：{{ currentSort }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('展开控制')">
            <view class="demo-stack">
                <text class="demo-variant-sub">
                    {{
                        text(
                            '排序项走 beforeToggle，展开前模拟 600ms 权限校验；resolve(false) 时不展开；控制按钮放在菜单栏上方，面板展开时才点得到'
                        )
                    }}
                </text>
                <view class="demo-row">
                    <text class="demo-variant-title">{{ text('允许展开') }}</text>
                    <snake-switch
                        :model-value="allowOpen"
                        :size="28"
                        @update:model-value="allowOpen = Boolean($event)"
                    />
                </view>
                <!-- 控制按钮放在菜单栏上方：面板向下展开只盖住栏下方，按钮才点得到 -->
                <view class="demo-row">
                    <snake-button size="small" :custom-style="{ flex: '1' }" @click="openFirst">
                        {{ text('展开第一项') }}
                    </snake-button>
                    <snake-button size="small" :custom-style="{ flex: '1' }" @click="toggleHighlight">
                        {{ highlighted ? text('取消高亮') : text('高亮第二项') }}
                    </snake-button>
                    <snake-button size="small" :custom-style="{ flex: '1' }" @click="closeControlMenu">
                        {{ text('收起') }}
                    </snake-button>
                </view>
                <snake-drop-menu ref="controlMenuRef">
                    <snake-drop-menu-item :title="text('排序')" :options="sortOptions" :before-toggle="guardToggle" />
                    <snake-drop-menu-item v-model="secondary" :title="text('分类')" :options="categoryOptions" />
                </snake-drop-menu>
                <text v-if="blocked" class="demo-variant-sub demo-variant-sub--blocked">
                    {{ text('展开被拦截') }}
                </text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { DropMenuExpose } from '../../../uni_modules/snake-ui/components/snake-drop-menu/types';
import type {
    DropMenuOption,
    DropMenuToggleContext
} from '../../../uni_modules/snake-ui/components/snake-drop-menu-item/types';

const { localeName, text } = useDemoLocale();

const mainMenuRef = ref<DropMenuExpose | null>(null);
const controlMenuRef = ref<DropMenuExpose | null>(null);

const category = ref('all');
const sort = ref('recommend');
const secondary = ref('all');
const allowOpen = ref(true);
const blocked = ref(false);
const highlighted = ref(false);

/** 第一个菜单项不传 title，标题直接跟随选中项文案。 */
const categoryOptions = computed<DropMenuOption[]>(() => [
    { label: text('全部'), value: 'all' },
    { label: text('手机'), value: 'phone' },
    { label: text('配件'), value: 'parts' }
]);
const sortOptions = computed<DropMenuOption[]>(() => [
    { label: text('综合'), value: 'recommend' },
    { label: text('销量'), value: 'sales' },
    { label: text('价格'), value: 'price' }
]);
const currentCategory = computed(
    () => categoryOptions.value.find(option => option.value === category.value)?.label ?? ''
);
const currentSort = computed(() => sortOptions.value.find(option => option.value === sort.value)?.label ?? '');

/** 自定义面板里的筛选项，勾选状态只在本页维护，确定后收起面板。 */
const chips = reactive([
    { key: 'stock', label: '有货', active: true },
    { key: 'free', label: '包邮', active: false },
    { key: 'novelty', label: '新品', active: false }
]);

function closeMainMenu() {
    mainMenuRef.value?.close();
}
function closeControlMenu() {
    controlMenuRef.value?.close();
}
function openFirst() {
    // open(index) 直接展开，不再走 beforeToggle
    controlMenuRef.value?.open(0);
}
/** highlight(index?) 只改标题高亮、不展开面板，传空即清除。 */
function toggleHighlight() {
    highlighted.value = !highlighted.value;
    controlMenuRef.value?.highlight(highlighted.value ? 1 : undefined);
}
function guardToggle({ resolve }: DropMenuToggleContext) {
    if (!allowOpen.value) {
        blocked.value = true;
        resolve(false);
        return;
    }
    blocked.value = false;
    setTimeout(() => resolve(true), 600);
}

const controls: DemoControl[] = [
    {
        key: 'menuActiveColor',
        label: '激活颜色',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    {
        key: 'menuTitleSize',
        label: '标题字号',
        type: 'slider',
        defaultValue: 14,
        min: 13,
        max: 18,
        step: 1,
        unit: 'px'
    },
    { key: 'menuHeight', label: '菜单栏高度', type: 'slider', defaultValue: 40, min: 36, max: 52, step: 1, unit: 'px' },
    { key: 'menuMaskClose', label: '点遮罩收起', type: 'switch', defaultValue: true },
    { key: 'menuSelfClose', label: '再点标题收起', type: 'switch', defaultValue: true },
    { key: 'menuBorderBottom', label: '底部边框', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return localizeDemoControls(controls);
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('drop-menu', '下拉菜单');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-drop-menu-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 12px;
    line-height: 1.5;
}
.demo-variant-sub--blocked {
    color: var(--snake-color-error);
}
.demo-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}
.demo-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.demo-panel__chip {
    display: flex;
    height: 32px;
    align-items: center;
    padding: 0 14px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 16px;
    background-color: var(--snake-color-surface);
}
.demo-panel__chip.is-active {
    border-color: var(--snake-color-primary);
    background-color: var(--snake-color-primary);
}
.demo-panel__chip-label {
    font-size: 13px;
    line-height: 1;
    color: var(--snake-color-text-secondary);
}
.demo-panel__chip.is-active .demo-panel__chip-label {
    color: var(--snake-color-white);
    font-weight: 600;
}
</style>
