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
@import './demo/theme.scss';

page {
    min-height: 100%;
    background: var(--snake-bg-page);
    color: var(--snake-text-main);
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    -webkit-font-smoothing: antialiased;
}
</style>
