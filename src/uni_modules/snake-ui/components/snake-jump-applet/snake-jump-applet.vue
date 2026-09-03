<template>
    <view :style="$snakeThemeStyle">
        <view class="jumpApplet" v-if="datas.isButton">
            <button
                class="jumpAppletBtn"
                :style="{ color: datas.textColor, backgroundColor: datas.btnColor }"
                @click="jump"
            >
                {{ datas.title }}
            </button>
        </view>
        <image v-else :src="datas.imageUrl" mode="widthFix" @click="jump"></image>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeJumpApplet
 * @description 通过按钮或图片触发小程序、H5 URL Scheme 或企业微信承接页跳转。
 * @see /components/jump-applet
 */

import { computed, onMounted } from 'vue';
import { resolveSnakeCmsOptions } from '../../libs/cms';
import { toast } from '../../libs/function/platform';
import {
    SnakeCmsError,
    type SnakeCmsLinkAction,
} from '../snake-cms/types';
import type { SnakeJumpAppletEmits, SnakeJumpAppletProps } from './types';

defineOptions({ name: 'SnakeJumpApplet', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(
    defineProps<SnakeJumpAppletProps>(),
    { datas: () => ({}), linkService: undefined, pageInfo: () => ({}) }
);
const emit = defineEmits<SnakeJumpAppletEmits>();
const service = computed(() => props.linkService || resolveSnakeCmsOptions().services?.link);

async function jump(): Promise<void> {
    if (!props.datas.path) {
        toast('缺少跳转页面路径');
        return;
    }
    if (!props.datas.isWeCom && !props.datas.appId) {
        toast('缺少 appId');
        return;
    }
    if (!service.value) {
        const error = new SnakeCmsError('link', '未配置 CMS 跳转服务');
        emit('error', error);
        toast(error.message);
        return;
    }
    let action: SnakeCmsLinkAction;
    if (props.datas.isWeCom) {
        action = { type: 'external', url: props.datas.path };
    } else {
        action = {
            type: 'mini-program',
            appId: props.datas.appId,
            path: `${props.datas.path}${props.datas.query || ''}`,
            extraData: props.datas.extraData || {},
            envVersion: props.datas.envVersion
        };
        // #ifdef H5
        action = {
            type: 'scheme',
            appId: props.datas.appId,
            path: props.datas.path,
            query: props.datas.query
        };
        // #endif
    }
    try {
        await service.value.open(action, { pageInfo: props.pageInfo });
    } catch (cause) {
        const error = new SnakeCmsError('link', '页面跳转失败', cause);
        emit('error', error);
        toast(error.message);
    }
}

onMounted(() => {
    if (props.datas.isAuto) void jump();
});
</script>

<style lang="scss" scoped>
.jumpApplet {
    margin: 10rpx 40rpx;
}

.jumpAppletBtn {
    cursor: pointer;

    &::after {
        border: none;
    }
}
</style>
