<template>
    <!-- 无 UI 状态组件：只维护倒计时与文案，界面由宿主通过 @change 渲染。 -->
    <view class="snake-verification-code" />
</template>

<script setup lang="ts">
/**
 * @component VerificationCode
 * @description 验证码倒计时状态机。不渲染界面，通过 change 事件输出当前文案，start / reset 由宿主调用。
 * @see /components/verification-code
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLocale } from '../../libs/hooks/useLocale';
import type { VerificationCodeEmits, VerificationCodeProps } from './types';

defineOptions({ name: 'SnakeVerificationCode', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<VerificationCodeProps>(), {
    seconds: 60,
    startText: '',
    changeText: '',
    endText: '',
    keepRunning: false,
    uniqueKey: ''
});
const emit = defineEmits<VerificationCodeEmits>();
const { t } = useLocale('verificationCode');

const startText = computed(() => props.startText || t('startText'));
const changeText = computed(() => props.changeText || t('changeText'));
const endText = computed(() => props.endText || t('endText'));

const canGetCode = ref(true);
let remain = Number(props.seconds) > 0 ? Number(props.seconds) : 60;
let timer: ReturnType<typeof setInterval> | null = null;

watch(
    () => props.seconds,
    value => {
        if (!timer) remain = Number(value) > 0 ? Number(value) : 60;
    }
);

const storageKey = computed(() => `snake-ui-verification-code${props.uniqueKey ? `:${props.uniqueKey}` : ''}`);

function readDeadline(): number {
    try {
        return Number(uni.getStorageSync(storageKey.value)) || 0;
    } catch {
        return 0;
    }
}

function writeDeadline(): void {
    try {
        uni.setStorageSync(storageKey.value, Math.floor(Date.now() / 1000) + remain);
    } catch {
        /* 存储不可用时静默降级为不续跑 */
    }
}

function clearDeadline(): void {
    try {
        uni.removeStorageSync(storageKey.value);
    } catch {
        /* 存储不可用时忽略 */
    }
}

function stopTimer(): void {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function restartSeconds(): void {
    remain = Number(props.seconds) > 0 ? Number(props.seconds) : 60;
}

/** 开始倒计时；进行中重复调用无效 */
function start(): void {
    if (!canGetCode.value) return;
    stopTimer();
    canGetCode.value = false;
    emit('start');
    emit('change', changeText.value.replace(/x|X/, String(remain)));
    writeDeadline();
    timer = setInterval(() => {
        remain -= 1;
        if (remain > 0) {
            emit('change', changeText.value.replace(/x|X/, String(remain)));
            return;
        }
        stopTimer();
        clearDeadline();
        canGetCode.value = true;
        emit('change', endText.value);
        emit('end');
        restartSeconds();
    }, 1000);
}

/** 重置倒计时并恢复可获取状态 */
function reset(): void {
    stopTimer();
    clearDeadline();
    canGetCode.value = true;
    restartSeconds();
    emit('change', endText.value);
}

onMounted(() => {
    if (props.keepRunning) {
        const left = readDeadline() - Math.floor(Date.now() / 1000);
        if (left > 0) {
            remain = left;
            start();
            return;
        }
        clearDeadline();
    }
    emit('change', startText.value);
});

onBeforeUnmount(() => {
    if (timer && !props.keepRunning) clearDeadline();
    stopTimer();
});

defineExpose({ start, reset, canGetCode });
</script>

<style scoped>
.snake-verification-code {
    width: 0;
    height: 0;
}
</style>
