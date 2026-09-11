<template>
    <view>
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
 * @component JumpApplet
 * @description 通过按钮或图片触发小程序、H5 URL Scheme 或企业微信承接页跳转。
 */

import { computed, onMounted } from 'vue';
import { resolveCmsOptions } from '../../libs/cms';
import { toast } from '../../libs/function/toast';
import { CmsError, type CmsLinkAction } from '../snake-cms/types';
import type { JumpAppletEmits, JumpAppletProps } from './types';

defineOptions({ name: 'JumpApplet', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<JumpAppletProps>(), {
    datas: () => ({}),
    linkService: undefined,
    pageInfo: () => ({})
});
const emit = defineEmits<JumpAppletEmits>();
const service = computed(() => props.linkService || resolveCmsOptions().services?.link);

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
        const error = new CmsError('link', '未配置 CMS 跳转服务');
        emit('error', error);
        toast(error.message);
        return;
    }
    let action: CmsLinkAction;
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
        const error = new CmsError('link', '页面跳转失败', cause);
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
