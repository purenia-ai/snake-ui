<template>
    <DemoPage
        :title="title"
        :desc="text('展示用户或品牌头像，图片加载失败时降级为文字或图标，也可以叠成头像组并折叠。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-avatar-showcase">
                <snake-avatar
                    :src="heroSrc"
                    :shape="state.aShape"
                    :size="state.aSize"
                    bg-color="#06D290"
                    color="#FFFFFF"
                    @click="onHeroClick"
                    @error="onHeroError"
                />
                <view class="demo-avatar-meta">
                    <text class="demo-avatar-meta__tag">{{ shapeLabel }}</text>
                    <text>{{ clickLabel }}</text>
                </view>
                <text class="demo-variant-sub">
                    {{ text('图片来自本地静态资源；打开“模拟加载失败”后换成不存在的地址，头像会自动降级') }}
                </text>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('形状与尺寸')">
            <view class="demo-avatar-grid">
                <view v-for="item in shapeSamples" :key="item.key" class="demo-avatar-cell">
                    <snake-avatar
                        src="/static/logo.png"
                        :shape="item.shape"
                        :size="item.size"
                        :radius="item.shape === 'square' ? 8 : 6"
                    />
                    <text class="demo-avatar-cell__title">{{ text(item.label) }} {{ item.size }}</text>
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('内容与兜底')">
            <view class="demo-avatar-rows">
                <view v-for="row in contentSamples" :key="row.key" class="demo-avatar-row">
                    <text class="demo-avatar-row__label">{{ text(row.label) }}</text>
                    <snake-avatar v-if="row.key === 'slot'" size="40" bg-color="#26273A" color="#FFFFFF">
                        <text class="demo-avatar-slot">VIP</text>
                    </snake-avatar>
                    <snake-avatar
                        v-else
                        :src="row.src"
                        :text="row.text"
                        :icon="row.icon"
                        size="40"
                        :bg-color="row.bg"
                        :color="row.color"
                    />
                </view>
            </view>
            <text class="demo-variant-sub demo-avatar-note">
                {{ text('没有图片时按 文字 → 图标 → 内置人像图标 的顺序兜底') }}
            </text>
        </DemoSection>

        <DemoSection variant="preview" :title="text('加载失败回退')">
            <view class="demo-avatar-rows">
                <view class="demo-avatar-row">
                    <text class="demo-avatar-row__label">{{ text('文字兜底') }}</text>
                    <snake-avatar src="/static/not-found.png" text="李" size="40" bg-color="#06D290" color="#FFFFFF" />
                </view>
                <view class="demo-avatar-row">
                    <text class="demo-avatar-row__label">{{ text('图标兜底') }}</text>
                    <snake-avatar src="/static/not-found.png" icon="account-fill" size="40" />
                </view>
                <view class="demo-avatar-row">
                    <text class="demo-avatar-row__label">{{ text('内置占位') }}</text>
                    <snake-avatar src="/static/not-found.png" size="40" />
                </view>
            </view>
            <text class="demo-variant-sub demo-avatar-note">
                {{ text('三个头像的地址都不存在：有文字用文字，有图标用图标，都没有就退到内置的人像图标') }}
            </text>
        </DemoSection>

        <DemoSection variant="preview" :title="text('头像组')">
            <view class="demo-stack demo-avatar-group-showcase">
                <view class="demo-avatar-group-row">
                    <text class="demo-avatar-row__label">{{ text('按控件配置') }}</text>
                    <snake-avatar-group
                        :size="36"
                        :max-count="maxCountValue"
                        :total="totalValue"
                        :cascading="state.aCascading"
                    >
                        <snake-avatar
                            v-for="person in people"
                            :key="person.key"
                            :text="person.text"
                            :bg-color="person.bg"
                            color="#FFFFFF"
                        />
                    </snake-avatar-group>
                </view>
                <view class="demo-avatar-group-row">
                    <text class="demo-avatar-row__label">{{ text('后压前') }}</text>
                    <snake-avatar-group :size="36" :max-count="4" cascading="last-on-top">
                        <snake-avatar
                            v-for="person in people"
                            :key="person.key"
                            :text="person.text"
                            :bg-color="person.bg"
                            color="#FFFFFF"
                        />
                    </snake-avatar-group>
                </view>
                <view class="demo-avatar-group-row">
                    <text class="demo-avatar-row__label">{{ text('前压后') }}</text>
                    <snake-avatar-group :size="36" :max-count="4" cascading="first-on-top">
                        <snake-avatar
                            v-for="person in people"
                            :key="person.key"
                            :text="person.text"
                            :bg-color="person.bg"
                            color="#FFFFFF"
                        />
                    </snake-avatar-group>
                </view>
                <text class="demo-variant-sub">
                    {{ text('超出 max-count 折叠成 +N；只渲染部分子项时要传 total，否则只能数到已渲染的数量') }}
                </text>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { demoState, setDemoValue } from '../../../common/demo-state';
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { text } = useDemoLocale();

/** 头像组里演示用的头像；字母取自姓氏，颜色只是让叠层更容易分辨。 */
const people = [
    { key: 'p1', text: '张', bg: '#06D290' },
    { key: 'p2', text: '李', bg: '#2563EB' },
    { key: 'p3', text: '王', bg: '#FF9900' },
    { key: 'p4', text: '陈', bg: '#FA3534' },
    { key: 'p5', text: '刘', bg: '#8B5CF6' }
];

const shapeSamples = [
    { key: 's32', label: '圆形', shape: 'circle' as const, size: 32 },
    { key: 's40', label: '圆形', shape: 'circle' as const, size: 40 },
    { key: 's48', label: '圆形', shape: 'circle' as const, size: 48 },
    { key: 's64', label: '圆形', shape: 'circle' as const, size: 64 },
    { key: 'q40', label: '方形', shape: 'square' as const, size: 40 },
    { key: 'q48', label: '方形', shape: 'square' as const, size: 48 }
];

const contentSamples = [
    { key: 'image', label: '图片', src: '/static/logo.png', text: '', icon: '', bg: '#06D290', color: '#FFFFFF' },
    { key: 'text', label: '文字', src: '', text: '张', icon: '', bg: '#06D290', color: '#FFFFFF' },
    { key: 'icon', label: '图标', src: '', text: '', icon: 'account-fill', bg: '', color: '' },
    { key: 'empty', label: '内置占位', src: '', text: '', icon: '', bg: '', color: '' },
    { key: 'slot', label: '插槽', src: '', text: '', icon: '', bg: '', color: '' }
];

const controls = [
    {
        key: 'aShape',
        label: '形状',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
        ]
    },
    { key: 'aSize', label: '头像尺寸', type: 'slider', defaultValue: 48, min: 24, max: 72, step: 2, unit: 'px' },
    { key: 'aBroken', label: '模拟加载失败', type: 'switch', defaultValue: false },
    { key: 'aMaxCount', label: '最多显示数量', type: 'input', defaultValue: '3', placeholder: 'max-count' },
    { key: 'aTotal', label: '真实总数', type: 'input', defaultValue: '128', placeholder: 'total' },
    {
        key: 'aCascading',
        label: '层级方向',
        type: 'select',
        defaultValue: 'last-on-top',
        options: [
            { label: '后压前', value: 'last-on-top' },
            { label: '前压后', value: 'first-on-top' }
        ]
    }
] as const satisfies readonly DemoControl[];
const state = demoState(controls);

const clickCount = ref(0);
const errorSeen = ref(false);
const heroSrc = computed(() => (state.aBroken ? '/static/not-found.png' : '/static/logo.png'));
const shapeLabel = computed(() => (state.aShape === 'square' ? text('方形') : text('圆形')));
const clickLabel = computed(() =>
    errorSeen.value && state.aBroken
        ? text('图片加载失败，已降级')
        : clickCount.value > 0
          ? `${text('已点击')} ${clickCount.value} ${text('次')}`
          : text('点击头像试试')
);
const maxCountValue = computed(() => {
    const value = Number(state.aMaxCount);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
});
const totalValue = computed(() => {
    const value = Number(state.aTotal);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
});
const localizedControls = computed(() => localizeDemoControls(controls));
const title = computed(() => demoTitle('avatar', '头像'));

function updateValue(key: string, value: DemoValue) {
    setDemoValue(state, key, value);
    if (key === 'aBroken') errorSeen.value = false;
    if (key === 'aShape' || key === 'aSize') clickCount.value = 0;
}
function onHeroClick() {
    clickCount.value += 1;
}
function onHeroError() {
    errorSeen.value = true;
}
</script>

<style scoped>
.demo-avatar-showcase {
    align-items: flex-start;
}
.demo-avatar-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-avatar-meta__tag {
    padding: 2px 8px;
    border-radius: 10px;
    background-color: var(--snake-color-primary-light);
    color: var(--snake-color-primary);
    font-size: 12px;
    line-height: 1.5;
}
.demo-avatar-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}
.demo-avatar-cell {
    display: flex;
    min-height: 92px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 6px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}
.demo-avatar-cell__title {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}
.demo-avatar-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-avatar-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.demo-avatar-row__label {
    flex: none;
    width: 72px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.4;
}
.demo-avatar-slot {
    color: inherit;
    font-size: 13px;
    letter-spacing: 0.5px;
}
.demo-avatar-note {
    display: block;
    margin-top: 12px;
}
.demo-avatar-group-showcase {
    align-items: flex-start;
    gap: 14px;
}
.demo-avatar-group-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
