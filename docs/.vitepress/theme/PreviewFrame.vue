<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';

const props = defineProps<{ mobile?: boolean }>();

const { frontmatter, title } = useData();
const loaded = ref(false);
const timedOut = ref(false);
const retryCount = ref(0);
let timer: ReturnType<typeof setTimeout> | undefined;

// 手机壳基准宽度为 375px,视口空间不足时保持真机比例缩放,视口空间不足时按断点+高度等比缩放。
// CSS 无法做长度除法,缩放系数在此计算后写入 --preview-scale 供 custom.css 消费。
const PHONE_WIDTH = 375;
const PHONE_HEIGHT = (375 * 143.6) / 70.9;

function updateScale() {
    if (typeof window === 'undefined') return;
    const budgetWidth = window.innerWidth >= 1680 ? 375 : window.innerWidth >= 1450 ? 320 : 300;
    const budgetHeight = window.innerHeight - 130;
    const scale = Math.max(0.5, Math.min(budgetWidth / PHONE_WIDTH, budgetHeight / PHONE_HEIGHT, 1));
    document.documentElement.style.setProperty('--preview-scale', scale.toFixed(3));
}

const previewRoute = computed(() => frontmatter.value.preview as string | undefined);
const previewUrl = computed(() => {
    if (!previewRoute.value) return '';
    if (!import.meta.env.DEV) return `/snake-ui/h5/#/${previewRoute.value.replace(/^\/+/, '')}`;

    // Keep the iframe on the same reachable host as VitePress. This is important
    // when the docs are opened through a LAN IP: localhost would point to the
    // visitor's own machine instead of the computer running the H5 preview.
    const host =
        typeof window !== 'undefined' && window.location.hostname
            ? window.location.hostname === 'localhost'
                ? '127.0.0.1'
                : window.location.hostname
            : '127.0.0.1';
    const protocol = typeof window !== 'undefined' && window.location.protocol ? window.location.protocol : 'http:';
    const base = `${protocol}//${host}:5173/snake-ui/h5/`;
    return `${base}#/${previewRoute.value.replace(/^\/+/, '')}`;
});
const previewKey = computed(() => `${previewUrl.value}:${retryCount.value}`);

function armTimeout() {
    loaded.value = false;
    timedOut.value = false;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        timedOut.value = true;
    }, 8000);
}

function markLoaded() {
    loaded.value = true;
    timedOut.value = false;
    if (timer) clearTimeout(timer);
}

function retryPreview() {
    retryCount.value += 1;
    armTimeout();
}

watch(previewUrl, armTimeout, { immediate: true });
onMounted(() => {
    if (props.mobile) return;
    updateScale();
    window.addEventListener('resize', updateScale);
});
onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
    if (!props.mobile && typeof window !== 'undefined') window.removeEventListener('resize', updateScale);
});
</script>

<template>
    <a v-if="mobile && previewUrl" class="preview-mobile-link" :href="previewUrl" target="_blank" rel="noreferrer">
        在新窗口打开实时预览
    </a>
    <section v-else-if="previewUrl" class="preview-panel" aria-label="组件实时预览">
        <div class="preview-phone">
            <div class="preview-phone__system-status" aria-hidden="true">
                <span class="preview-phone__time">9:41</span>
                <span class="preview-phone__indicators">
                    <i class="preview-phone__signal" />
                    <svg class="preview-phone__wifi" viewBox="0 0 16 16" aria-hidden="true">
                        <path
                            d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"
                        />
                        <path
                            d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"
                        />
                    </svg>
                    <i class="preview-phone__battery"><i /></i>
                </span>
            </div>
            <div class="preview-phone__island" />
            <iframe
                :key="previewKey"
                :src="previewUrl"
                :title="`${title} 实时预览`"
                loading="eager"
                scrolling="auto"
                @load="markLoaded"
            />
            <div v-if="!loaded && !timedOut" class="preview-phone__status" role="status" aria-live="polite">
                正在连接 H5 预览…
            </div>
            <div
                v-else-if="timedOut"
                class="preview-phone__status preview-phone__status--error"
                role="status"
                aria-live="polite"
            >
                <strong>预览服务未启动</strong>
                <span>请运行 <code>pnpm docs:dev:preview</code></span>
                <div class="preview-phone__status-actions">
                    <button type="button" @click="retryPreview">重新连接</button>
                    <a :href="previewUrl" target="_blank" rel="noreferrer">新窗口打开</a>
                </div>
            </div>
        </div>
    </section>
</template>
