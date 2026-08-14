<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { addUnit } from '../../libs';
import type { SnakeIconEmits, SnakeIconProps } from './types';

defineOptions({ name: 'SnakeIcon', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeIconProps>(), {
    name: '',
    color: 'currentColor',
    size: 16,
    bold: false,
    index: '',
    label: '',
    labelPos: 'right',
    labelColor: 'var(--snake-color-text-secondary, #606266)',
    labelSize: 14,
    space: 6,
    customPrefix: '',
    customClass: '',
    hoverClass: 'none',
    imgMode: 'widthFix',
    width: '',
    height: '',
    top: 0,
    stop: false,
    customStyle: ''
});
const emit = defineEmits<SnakeIconEmits>();

const glyphs: Record<string, string> = {
    search: '⌕',
    close: '×',
    close2: '×',
    plus: '+',
    minus: '−',
    checkmark: '✓',
    'checkmark-circle': '✓',
    'checkmark-circle-fill': '●',
    'close-circle': '⊗',
    'close-circle-fill': '⊗',
    info: 'ⓘ',
    'info-circle': 'ⓘ',
    warning: '⚠',
    'warning-fill': '⚠',
    question: '?',
    left: '‹',
    right: '›',
    up: '⌃',
    down: '⌄',
    'arrow-left': '←',
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
    home: '⌂',
    menu: '☰',
    more: '•••',
    star: '☆',
    'star-fill': '★',
    heart: '♡',
    'heart-fill': '♥',
    play: '▷',
    'play-right': '▷',
    'play-right-fill': '▶',
    pause: 'Ⅱ',
    stop: '■',
    camera: '◉',
    image: '▣',
    trash: '⌫',
    edit: '✎',
    share: '↗',
    refresh: '↻',
    lock: '▣',
    unlock: '□',
    eye: '◉',
    'eye-off': '⊘',
    phone: '☎',
    calendar: '▦',
    location: '⌖',
    clock: '◷',
    download: '⇩',
    upload: '⇧',
    filter: '▽',
    setting: '⚙'
};
const isImage = computed(() => /^(https?:|data:|\/|\.\/|\.\.\/)/i.test(props.name));
const glyph = computed(() => glyphs[props.name] || (props.customPrefix ? '' : props.name));
const rootStyle = computed(() => [
    {
        color: props.color,
        fontSize: addUnit(props.size),
        fontWeight: props.bold ? '700' : '400',
        top: addUnit(props.top),
        flexDirection: props.labelPos === 'bottom' ? 'column' : 'row'
    } as CSSProperties,
    props.customStyle
]);
const imageStyle = computed(() => ({
    width: addUnit(props.width || props.size),
    height: addUnit(props.height || props.size)
}));
const labelStyle = computed(() => ({
    color: props.labelColor,
    fontSize: addUnit(props.labelSize),
    marginLeft: props.labelPos === 'right' ? addUnit(props.space, 'rpx') : 0,
    marginTop: props.labelPos === 'bottom' ? addUnit(props.space, 'rpx') : 0
}));

function click(event: unknown) {
    if (props.stop && event && typeof (event as { stopPropagation?: () => void }).stopPropagation === 'function') {
        (event as { stopPropagation: () => void }).stopPropagation();
    }
    emit('click', event, props.index);
}
</script>

<template>
    <view
        class="snake-icon"
        :class="[customPrefix && `${customPrefix}-${name}`, customClass]"
        :style="[$snakeThemeStyle, rootStyle]"
        :hover-class="hoverClass"
        @click="click"
    >
        <image v-if="isImage" class="snake-icon__image" :src="name" :mode="imgMode as any" :style="imageStyle" />
        <text v-else class="snake-icon__glyph">{{ glyph }}</text>
        <text v-if="label !== ''" class="snake-icon__label" :style="labelStyle">{{ label }}</text>
    </view>
</template>

<style scoped>
.snake-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    vertical-align: middle;
}
.snake-icon__glyph {
    font: inherit;
    line-height: 1;
}
.snake-icon__image {
    display: block;
    flex: none;
}
.snake-icon__label {
    white-space: nowrap;
    line-height: 1.35;
}
</style>
