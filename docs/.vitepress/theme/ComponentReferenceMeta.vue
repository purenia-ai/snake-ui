<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { componentItems } from '../component-groups'

const route = useRoute()
const item = computed(() => componentItems.find(candidate => withBase(candidate.link) === route.path.replace(/\.html$/, '')))
const documentName = computed(() => item.value?.link.slice('/components/'.length) || '')
const componentDirectory = computed(() =>
  documentName.value.startsWith('snake-') ? documentName.value : `snake-${documentName.value}`,
)
const typeName = computed(() => {
  if (!item.value) return ''
  const componentName = item.value.name.startsWith('Snake') ? item.value.name : `Snake${item.value.name}`
  return `${componentName}Props`
})
const sourceUrl = computed(() => {
  if (!componentDirectory.value) return ''
  const path = `src/uni_modules/snake-ui/components/${componentDirectory.value}/${componentDirectory.value}.vue`
  return `https://github.com/zwbcode/snake-ui/blob/main/${path}`
})
</script>

<template>
  <section v-if="item" class="component-reference-meta" aria-labelledby="component-reference-meta-title">
    <div class="component-reference-meta__heading">
      <div>
        <p>Release contract</p>
        <h2 id="component-reference-meta-title">发布信息</h2>
      </div>
      <span>{{ item.cms ? 'CMS' : item.group }}</span>
    </div>
    <dl>
      <div>
        <dt>最低版本</dt>
        <dd><code>{{ item.since }}</code></dd>
      </div>
      <div>
        <dt>Props 类型</dt>
        <dd><code>{{ typeName }}</code></dd>
      </div>
      <div>
        <dt>主题</dt>
        <dd><a :href="withBase('/guide/multi-theme')">CSS 变量与暗黑模式</a></dd>
      </div>
      <div>
        <dt>源码</dt>
        <dd><a :href="sourceUrl" target="_blank" rel="noreferrer">查看组件实现</a></dd>
      </div>
    </dl>
    <p class="component-reference-meta__note">
      H5、微信小程序和 App 的原生能力存在差异；发布前请结合本页平台说明在目标端验证。
    </p>
  </section>
</template>
