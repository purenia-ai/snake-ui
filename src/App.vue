<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
onLaunch(() => {
    console.log('App Launch');
});
onShow(() => {
    console.log('App Show');
});
onHide(() => {
    console.log('App Hide');
});
</script>
<style lang="scss">
@import './uni_modules/snake-ui/index.scss';
@import './common/demo.scss';

page {
    min-height: 100%;
    background: var(--snake-color-background);
    color: var(--snake-color-text);
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* 文档手机预览中隐藏滚动条（滚动功能保留），贴近真机表现 */
/* #ifdef H5 */
html,
body,
uni-app,
uni-page,
uni-page-wrapper {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}
/* #endif */
</style>
