<script setup lang="ts">
import { withBase } from 'vitepress';
import { onBeforeUnmount, ref } from 'vue';
import { componentCount, componentGroups } from '../component-groups';
import { toolGroups } from '../tool-groups';

const cmsCount = componentGroups.flatMap(group => group.items).filter(item => item.cms).length;
const toolCount = toolGroups.reduce((total, group) => total + group.items.length, 0);
const supportedPlatforms = [
    'H5',
    'App',
    'HarmonyOS',
    '微信小程序',
    '支付宝小程序',
    '百度小程序',
    '京东小程序',
    '快手小程序',
    '飞书小程序',
    'QQ 小程序',
    '抖音小程序',
    '小红书小程序',
    '快应用'
];
const stats = [
    {
        value: componentCount,
        suffix: '+',
        label: '精选组件',
        hint: '覆盖商城高频场景',
        icon: 'M4 5.5 12 2l8 3.5-8 3.5-8-3.5Zm0 0V14l8 4 8-4V5.5M12 9v9'
    },
    {
        value: cmsCount,
        suffix: '',
        label: 'CMS 模块',
        hint: '配置驱动页面装修',
        icon: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z'
    },
    {
        value: toolCount,
        suffix: '+',
        label: '工具文档',
        hint: '函数与 Hooks 体系',
        icon: 'm14.7 6.3 3-3 3 3-3 3m-2-1 2 2L8.4 18.6a2 2 0 0 1-2.8 0l-.2-.2a2 2 0 0 1 0-2.8L15.7 5.3'
    },
    {
        value: supportedPlatforms.length,
        suffix: '+',
        label: '支持平台',
        hint: '一套代码，多端运行',
        icon: 'M4 5h16v10H4V5Zm5 14h6m-3-4v4M7 9h.01M10 9h7'
    }
];
const features = [
    {
        eyebrow: 'Schema first',
        title: 'CMS 配置驱动',
        details: '用 pageComponents 配置串联内容、导航、营销与商品模块，让页面装修有清晰的数据边界。',
        link: '/cms/getting-started'
    },
    {
        eyebrow: '50+ components',
        title: '商城组件体系',
        details: '从基础交互到商品列表、活动、优惠券和弹窗，覆盖商城页面的高频组合场景。',
        link: '/components/intro'
    },
    {
        eyebrow: 'Contract driven',
        title: '真实源码契约',
        details: 'Props、事件与数据字段均依据当前源码整理，让文档、示例与运行时保持一致。',
        link: '/cms/component-data'
    },
    {
        eyebrow: 'Theme system',
        title: '多主题与暗黑模式',
        details: '从品牌色到组件令牌统一管理，支持响应式切换和可复用的主题生成流程。',
        link: '/guide/multi-theme'
    },
    {
        eyebrow: 'Vue 3 + TypeScript',
        title: '现代工程体验',
        details: '面向 Vue 3、TypeScript 与组合式 API，提供清晰、可维护的组件和工具接口。',
        link: '/components/quickstart'
    },
    {
        eyebrow: 'H5 · App · Mini Program',
        title: '跨平台边界清晰',
        details: '明确标注 uni-app、业务适配器及小程序 API 等运行前提，减少跨端接入的不确定性。',
        link: '/guide/compatibility'
    }
];
const popular = [
    { name: 'SnakeCms', title: 'CMS 页面容器', tag: '核心', link: '/components/snake-cms' },
    { name: 'MagicCube', title: '魔方布局', tag: 'CMS', link: '/components/magic-cube' },
    { name: 'GoodsList', title: '商品列表', tag: '商城', link: '/components/goods-list' },
    { name: 'PictureAds', title: '轮播广告', tag: '营销', link: '/components/picture-ads' },
    { name: 'useTheme', title: '主题管理', tag: 'Hook', link: '/tools/use-theme' },
    { name: 'snakeHttp', title: 'HTTP 请求', tag: '工具', link: '/tools/http' }
];
const internalLink = (path: string) => withBase(path);
const installCommand = 'pnpm add @puresnake/snake-ui';
const copyStatus = ref('');
let copyTimer: ReturnType<typeof setTimeout> | undefined;

async function copyInstallCommand() {
    try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(installCommand);
        copyStatus.value = '已复制';
    } catch {
        copyStatus.value = '复制失败，请手动复制';
    }
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copyStatus.value = ''), 2400);
}

onBeforeUnmount(() => {
    if (copyTimer) clearTimeout(copyTimer);
});
</script>

<template>
    <main class="snake-home">
        <section class="snake-hero" aria-labelledby="snake-home-title">
            <div class="snake-hero__mesh" aria-hidden="true" />
            <div class="snake-home__container snake-hero__inner">
                <div class="snake-hero__content">
                    <p class="snake-kicker"><span /> UNI-APP · COMMERCE · CMS</p>
                    <h1 id="snake-home-title">把商城页面，<br /><span>组装成系统</span></h1>
                    <p class="snake-hero__lead">
                        Snake UI 是面向 uni-app 商城与 CMS
                        场景的组件库。用真实源码契约连接配置、组件与业务，让页面更快落地，也更容易维护。
                    </p>
                    <div class="snake-hero__badges" aria-label="技术栈">
                        <span>Vue 3</span><span>TypeScript</span><span>uni-app</span><span>CMS Ready</span>
                    </div>
                    <div class="snake-hero__actions">
                        <a class="snake-button snake-button--brand" :href="internalLink('/components/quickstart')"
                            >开发指南 <span>→</span></a
                        >
                        <a class="snake-button snake-button--soft" :href="internalLink('/components/intro')"
                            >浏览组件</a
                        >
                        <a
                            class="snake-button snake-button--ghost"
                            href="https://m.puresnake.com/snake-ui/h5/"
                            target="_blank"
                            rel="noreferrer"
                            >在线演示 ↗</a
                        >
                    </div>
                    <div class="snake-install" aria-label="安装 Snake UI">
                        <code>{{ installCommand }}</code>
                        <button type="button" @click="copyInstallCommand">{{ copyStatus || '复制' }}</button>
                        <span class="snake-install__status" aria-live="polite">{{ copyStatus }}</span>
                    </div>
                </div>
                <div class="snake-orbit" aria-hidden="true">
                    <div class="snake-orbit__halo snake-orbit__halo--outer" />
                    <div class="snake-orbit__halo snake-orbit__halo--inner" />
                    <div class="snake-orbit__core">
                        <img
                            class="snake-orbit__logo snake-orbit__logo--light"
                            :src="internalLink('/snake-mark-light.svg')"
                            alt=""
                        />
                        <img
                            class="snake-orbit__logo snake-orbit__logo--dark"
                            :src="internalLink('/snake-mark-dark.svg')"
                            alt=""
                        />
                    </div>
                    <div class="snake-float-card snake-float-card--cms"><b>CMS</b><span>配置驱动</span></div>
                    <div class="snake-float-card snake-float-card--theme"><b>Theme</b><span>多主题</span></div>
                    <div class="snake-float-card snake-float-card--platform"><b>Multi-end</b><span>一次开发</span></div>
                </div>
            </div>
            <a class="snake-scroll-cue" href="#snake-capabilities" aria-label="查看核心能力"
                ><i /><span>向下探索</span></a
            >
        </section>

        <section class="snake-stats" aria-label="项目概览">
            <div class="snake-home__container snake-stats__grid">
                <article v-for="stat in stats" :key="stat.label" class="snake-stat-card">
                    <div class="snake-stat-card__icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path :d="stat.icon" />
                        </svg>
                    </div>
                    <div class="snake-stat-card__content">
                        <p>
                            <strong>{{ stat.value }}</strong
                            ><em>{{ stat.suffix }}</em>
                        </p>
                        <b>{{ stat.label }}</b>
                        <span>{{ stat.hint }}</span>
                    </div>
                </article>
            </div>
        </section>

        <section id="snake-capabilities" class="snake-section snake-capabilities">
            <div class="snake-home__container">
                <header class="snake-section__header">
                    <p>WHY SNAKE UI</p>
                    <h2>为真实商城业务而生</h2>
                    <span>从页面装修到组件运行时，每一层都有明确契约。</span>
                </header>
                <div class="snake-feature-grid">
                    <a
                        v-for="(feature, index) in features"
                        :key="feature.title"
                        class="snake-feature-card"
                        :href="internalLink(feature.link)"
                    >
                        <span class="snake-feature-card__index">{{ String(index + 1).padStart(2, '0') }}</span>
                        <p>{{ feature.eyebrow }}</p>
                        <h3>{{ feature.title }}</h3>
                        <span>{{ feature.details }}</span
                        ><b>了解更多 <i>→</i></b>
                    </a>
                </div>
            </div>
        </section>

        <section class="snake-section snake-popular">
            <div class="snake-home__container">
                <header class="snake-section__header snake-section__header--row">
                    <div>
                        <p>POPULAR PICKS</p>
                        <h2>从高频能力开始</h2>
                        <span>组件、组合式函数与工具均可直接进入完整文档。</span>
                    </div>
                    <a :href="internalLink('/components/intro')">查看全部组件 →</a>
                </header>
                <div class="snake-popular__grid">
                    <a
                        v-for="item in popular"
                        :key="item.name"
                        :href="internalLink(item.link)"
                        class="snake-popular-card"
                        ><span class="snake-popular-card__mark">S</span>
                        <div>
                            <b>{{ item.name }}</b
                            ><span>{{ item.title }}</span>
                        </div>
                        <em>{{ item.tag }}</em
                        ><i>↗</i></a
                    >
                </div>
            </div>
        </section>

        <section class="snake-section snake-demo">
            <div class="snake-home__container snake-demo__panel">
                <div class="snake-demo__copy">
                    <p>LIVE EXPERIENCE</p>
                    <h2>文档与真实示例，保持同一步调</h2>
                    <span
                        >每个组件页面都能连接独立的 uni-app H5 演示。阅读 API、查看效果、回到源码，路径始终清晰。</span
                    >
                    <div class="snake-hero__actions">
                        <a
                            class="snake-button snake-button--brand"
                            href="https://m.puresnake.com/snake-ui/h5/"
                            target="_blank"
                            rel="noreferrer"
                            >打开在线演示 ↗</a
                        ><a class="snake-button snake-button--dark" :href="internalLink('/components/intro')"
                            >组件总览</a
                        >
                    </div>
                </div>
                <div class="snake-demo__window" aria-hidden="true">
                    <div class="snake-demo__window-bar"><i /><i /><i /><span>m.puresnake.com/snake-ui</span></div>
                    <div class="snake-demo__window-body">
                        <div class="snake-demo__phone">
                            <span /><strong>S</strong>
                            <p>Snake UI</p>
                            <i />
                        </div>
                        <div class="snake-demo__code"><span /><span /><span /><span /><b /></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="snake-section snake-next">
            <div class="snake-home__container">
                <header class="snake-section__header">
                    <p>START BUILDING</p>
                    <h2>选择你的下一步</h2>
                </header>
                <div class="snake-next__grid">
                    <a :href="internalLink('/components/quickstart')"
                        ><span>01</span>
                        <div>
                            <b>开发指南</b>
                            <p>完成安装、配置与第一处接入</p>
                        </div>
                        <i>→</i></a
                    >
                    <a :href="internalLink('/components/intro')"
                        ><span>02</span>
                        <div>
                            <b>组件总览</b>
                            <p>按业务域浏览全部组件</p>
                        </div>
                        <i>→</i></a
                    >
                    <a :href="internalLink('/tools/intro')"
                        ><span>03</span>
                        <div>
                            <b>工具与 Hooks</b>
                            <p>复用请求、主题与平台能力</p>
                        </div>
                        <i>→</i></a
                    >
                    <a href="https://github.com/zwbcode/snake-ui" target="_blank" rel="noreferrer"
                        ><span>04</span>
                        <div>
                            <b>源代码</b>
                            <p>查看实现并参与项目建设</p>
                        </div>
                        <i>↗</i></a
                    >
                </div>
            </div>
        </section>
    </main>
</template>
