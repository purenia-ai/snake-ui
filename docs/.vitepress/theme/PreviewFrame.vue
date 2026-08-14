<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'

defineProps<{ mobile?: boolean }>()

const { frontmatter, title } = useData()
const loaded = ref(false)
const timedOut = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const previewRoute = computed(() => frontmatter.value.preview as string | undefined)
const previewUrl = computed(() => {
  if (!previewRoute.value) return ''
  if (!import.meta.env.DEV) return `/preview/#/${previewRoute.value.replace(/^\/+/, '')}`

  // Keep the iframe on the same reachable host as VitePress. This is important
  // when the docs are opened through a LAN IP: localhost would point to the
  // visitor's own machine instead of the computer running the H5 preview.
  const host = typeof window !== 'undefined' && window.location.hostname
    ? (window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname)
    : '127.0.0.1'
  const protocol = typeof window !== 'undefined' && window.location.protocol
    ? window.location.protocol
    : 'http:'
  const base = `${protocol}//${host}:5173/preview/`
  return `${base}#/${previewRoute.value.replace(/^\/+/, '')}`
})

function armTimeout() {
  loaded.value = false
  timedOut.value = false
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timedOut.value = true
  }, 8000)
}

function markLoaded() {
  loaded.value = true
  timedOut.value = false
  if (timer) clearTimeout(timer)
}

watch(previewUrl, armTimeout, { immediate: true })
onBeforeUnmount(() => timer && clearTimeout(timer))
</script>

<template>
  <a v-if="mobile && previewUrl" class="preview-mobile-link" :href="previewUrl" target="_blank" rel="noreferrer">
    在新窗口打开实时预览
  </a>
  <section v-else-if="previewUrl" class="preview-panel" aria-label="组件实时预览">
    <header class="preview-panel__header">
      <span><i /> LIVE PREVIEW</span>
      <a :href="previewUrl" target="_blank" rel="noreferrer">新窗口 ↗</a>
    </header>
    <div class="preview-phone">
      <div class="preview-phone__speaker" />
      <iframe
        :key="previewUrl"
        :src="previewUrl"
        :title="`${title} 实时预览`"
        loading="eager"
        scrolling="auto"
        @load="markLoaded"
      />
      <div v-if="!loaded && !timedOut" class="preview-phone__status">正在连接 H5 预览…</div>
      <div v-else-if="timedOut" class="preview-phone__status preview-phone__status--error">
        预览服务未启动<br />请运行 pnpm docs:dev:preview
      </div>
    </div>
  </section>
</template>
