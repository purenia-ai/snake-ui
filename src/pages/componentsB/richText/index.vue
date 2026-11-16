<template>
    <DemoPage :title="title" :desc="text('渲染后台编辑的 HTML 正文，补齐图片、链接、表格与媒体交互。')">
        <DemoSection variant="preview" :title="text('文章正文')">
            <view class="demo-stack demo-rich-text-showcase">
                <snake-rich-text
                    :content="articleContent"
                    :tag-style="articleTagStyle"
                    :selectable="Boolean(state.selectable)"
                    @load="record('load')"
                    @ready="record('ready')"
                />
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('表格与横向滚动')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('普通表格') }}</text>
                <snake-rich-text :content="tableContent" :tag-style="tableTagStyle" />
                <text class="demo-variant-title">{{ text('宽表格，可单独横向滚动') }}</text>
                <snake-rich-text
                    :content="wideTableContent"
                    :tag-style="tableTagStyle"
                    :scroll-table="Boolean(state.scrollTable)"
                />
                <text class="demo-variant-title">{{ text('合并单元格') }}</text>
                <snake-rich-text :content="mergedTableContent" :tag-style="tableTagStyle" />
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('图片与占位')">
            <view class="demo-stack">
                <snake-rich-text
                    :content="imageContent"
                    :lazy-load="Boolean(state.lazyLoad)"
                    :preview-img="Boolean(state.previewImg)"
                    @imgtap="record('imgtap')"
                />
                <text class="demo-variant-sub">{{ text('点击图片预览，懒加载只在进入视口后请求图片') }}</text>
                <text class="demo-variant-title">{{ text('加载失败的图片用 error-img 兜底') }}</text>
                <snake-rich-text :content="brokenImageContent" :error-img="fallbackImage" @error="record('error')" />
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('音视频')">
            <view class="demo-stack">
                <snake-rich-text
                    :content="mediaContent"
                    :pause-video="Boolean(state.pauseVideo)"
                    @play="record('play')"
                    @error="record('error')"
                />
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('链接与锚点')">
            <view class="demo-stack">
                <snake-rich-text
                    ref="linkRef"
                    :content="linkContent"
                    :copy-link="Boolean(state.copyLink)"
                    use-anchor
                    @linktap="onLinkTap"
                />
                <view class="rich-text-actions">
                    <snake-button size="small" plain @click="jumpToAnchor">{{ text('跳到「出发清单」') }}</snake-button>
                    <snake-button size="small" plain @click="readPlainText">{{ text('读取纯文本') }}</snake-button>
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('空状态与插槽')">
            <view class="demo-stack">
                <view class="rich-text-actions">
                    <snake-button size="small" @click="loadNotice">{{ text('加载一段通知') }}</snake-button>
                    <snake-button size="small" plain @click="clearNotice">{{ text('清空内容') }}</snake-button>
                </view>
                <snake-rich-text :content="noticeHtml">
                    <view class="rich-text-empty">
                        <text class="rich-text-empty__text">{{ text('还没有新的内容') }}</text>
                    </view>
                </snake-rich-text>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('事件回调')">
            <view class="demo-stack">
                <view class="rich-text-events">
                    <text v-for="item in events" :key="item.id" class="rich-text-events__item">{{ item.label }}</text>
                    <text v-if="!events.length" class="rich-text-events__item rich-text-events__item--empty">
                        {{ text('暂无事件') }}
                    </text>
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import * as richTextContent from './content';

interface RichTextInstance {
    navigateTo: (id: string, offset?: number) => Promise<void>;
    getText: () => string;
}

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');

/*
 * 内容里的图片 / 视频地址由组件原样渲染。H5 部署在子路径（如 /snake-ui/h5/）时不会自动补前缀，
 * 这里按运行时路径补上；小程序与 App 用包内绝对路径，不需要改动。
 */
const assetBase =
    typeof window === 'undefined' || !window.location ? '/' : window.location.pathname.replace(/[^/]*$/, '');
const withBase = (value: string) => value.replace(/\/static\//g, `${assetBase}static/`);
const articleContent = withBase(richTextContent.articleContent);
const tableContent = withBase(richTextContent.tableContent);
const wideTableContent = withBase(richTextContent.wideTableContent);
const mergedTableContent = withBase(richTextContent.mergedTableContent);
const imageContent = withBase(richTextContent.imageContent);
const brokenImageContent = withBase(richTextContent.brokenImageContent);
const mediaContent = withBase(richTextContent.mediaContent);
const linkContent = withBase(richTextContent.linkContent);
const noticeContent = withBase(richTextContent.noticeContent);
const fallbackImage = withBase('/static/logo.png');

/*
 * 正文排版交给 tagStyle：颜色全部用主题变量，暗色模式下不会出现固定的灰底或深色文字。
 * 字号、行高、链接色则通过 --snake-rich-text-* 变量从页面容器继承（见文末样式）。
 */
const articleTagStyle = {
    h2: 'margin:0 0 6px;font-size:17px;font-weight:700;line-height:1.35;',
    h3: 'margin:14px 0 6px;font-size:14px;font-weight:600;line-height:1.4;',
    p: 'margin:0 0 9px;',
    blockquote:
        'margin:10px 0;padding:7px 11px;border-left:3px solid var(--snake-color-primary);' +
        'background:var(--snake-color-primary-light);font-size:12px;line-height:1.7;' +
        'color:var(--snake-color-text-secondary);',
    ul: 'margin:0 0 9px;padding-left:17px;',
    li: 'margin:3px 0;line-height:1.7;'
};
const tableTagStyle = {
    table: 'width:100%;border-collapse:collapse;font-size:12px;',
    th: 'border:1px solid var(--snake-color-divider);background:var(--snake-color-surface-muted);padding:5px 7px;font-weight:600;text-align:left;',
    td: 'border:1px solid var(--snake-color-divider);padding:5px 7px;'
};

const linkRef = ref<RichTextInstance | null>(null);
const noticeHtml = ref('');
const events = ref<{ id: number; label: string }[]>([]);
let eventId = 0;

const controls: DemoControl[] = [
    { key: 'lazyLoad', label: '图片懒加载', type: 'switch', defaultValue: true },
    { key: 'scrollTable', label: '表格横向滚动', type: 'switch', defaultValue: true },
    { key: 'previewImg', label: '点击图片预览', type: 'switch', defaultValue: true },
    { key: 'pauseVideo', label: '暂停其他视频', type: 'switch', defaultValue: true },
    { key: 'selectable', label: '长按选择文本', type: 'switch', defaultValue: true },
    { key: 'copyLink', label: '站外链接自动打开', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('rich-text', '富文本');
});

function record(name: string, detail?: string) {
    eventId += 1;
    events.value = [{ id: eventId, label: detail ? `${name} · ${detail}` : name }, ...events.value].slice(0, 5);
}
function onLinkTap(attrs: { href?: string; innerText?: string }) {
    record('linktap', attrs.innerText || attrs.href);
}
function jumpToAnchor() {
    linkRef.value?.navigateTo('rich-text-gear', 12).catch(() => record('navigateTo', text('锚点未找到')));
}
function readPlainText() {
    const plain = linkRef.value?.getText() || '';
    record('getText', isEnglish.value ? `${plain.length} chars` : `${plain.length} 字`);
}
function loadNotice() {
    noticeHtml.value = noticeContent;
}
function clearNotice() {
    noticeHtml.value = '';
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* 主题变量声明在容器上，组件根节点继承即可，不需要 :deep 穿透。 */
    --snake-rich-text-font-size: 13px;
    --snake-rich-text-line-height: 1.85;
    --snake-rich-text-image-radius: 8px;
}
.rich-text-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.rich-text-events {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 20px;
}
.rich-text-events__item {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.rich-text-events__item--empty {
    color: var(--snake-color-text-muted);
    font-family: inherit;
}
.rich-text-empty {
    padding: 18px 12px;
    border-radius: 6px;
    background: var(--snake-color-surface-muted);
    text-align: center;
}
.rich-text-empty__text {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 12px;
    line-height: 1.6;
}
</style>
