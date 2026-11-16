<template>
    <view
        class="snake-steps"
        :class="[`snake-steps--${direction}`, { 'snake-steps--dot': dot }, customClass]"
        :style="customStyle"
    >
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * @component Steps
 * @description 步骤条容器：按当前索引推导每个子步骤的状态，横向或纵向展示流程进度。
 * @see /components/steps
 */
import { toRef, type ComponentPublicInstance } from 'vue';
import { useChildren } from '../../libs/hooks';
import { stepsContextKey, stepsProps, type StepsContext } from './types';

defineOptions({ name: 'SnakeSteps', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(stepsProps);

// 子步骤按模板顺序注册，状态由父级的 current 统一推导，子项只读上下文
const { linkChildren } = useChildren<ComponentPublicInstance, StepsContext>(stepsContextKey);

linkChildren({
    current: toRef(props, 'current'),
    direction: toRef(props, 'direction'),
    activeColor: toRef(props, 'activeColor'),
    inactiveColor: toRef(props, 'inactiveColor'),
    errorColor: toRef(props, 'errorColor'),
    alignCenter: toRef(props, 'alignCenter'),
    dot: toRef(props, 'dot')
});
</script>

<style scoped>
.snake-steps {
    display: flex;
    box-sizing: border-box;
    width: 100%;
}

.snake-steps--horizontal {
    flex-direction: row;
    align-items: flex-start;
}

.snake-steps--vertical {
    flex-direction: column;
}
</style>
