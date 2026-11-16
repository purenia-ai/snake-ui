---
preview: /pages/componentsA/collapse/index
---

# Collapse 折叠面板

把长内容折叠成标题行，用于商品参数、FAQ、售后说明；支持多项展开与手风琴模式。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`v-model` 绑定展开项数组，每个 `snake-collapse-item` 用 `name` 作为唯一标识：

```vue
<snake-collapse v-model="active">
    <snake-collapse-item title="商品参数" name="spec">
        <view>材质：棉 95%、氨纶 5%</view>
        <view>产地：浙江</view>
    </snake-collapse-item>
    <snake-collapse-item title="售后说明" name="after">
        <view>签收后 7 天内可申请无理由退货。</view>
    </snake-collapse-item>
</snake-collapse>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref<string[]>(['spec']);
</script>
```

## 手风琴模式

`accordion` 下 `v-model` 用单值，同时只允许展开一项：

```vue
<snake-collapse v-model="current" accordion>
    <snake-collapse-item title="如何退换货？" name="q1" />
    <snake-collapse-item title="运费谁承担？" name="q2" />
</snake-collapse>
```

## 禁用与自定义

`disabled` 阻止展开；`title` / `value` 插槽可放自定义内容：

```vue
<snake-collapse v-model="active">
    <snake-collapse-item name="stock" disabled title="库存紧张，暂不可选" />
    <snake-collapse-item name="vip">
        <template #title>会员权益 <snake-tag type="warning" size="mini" text="NEW" /></template>
        <template #value>查看</template>
        <view>满 199 元包邮</view>
    </snake-collapse-item>
</snake-collapse>
```

## API

### Props

| 参数          | 说明                                 | 类型                                       | 默认值  |
| ------------- | ------------------------------------ | ------------------------------------------ | ------- |
| `customStyle` | 根节点自定义样式                     | `StyleValue`                               | `''`    |
| `customClass` | 根节点自定义类名                     | `string`                                   | `''`    |
| `modelValue`  | 展开项，手风琴模式为单值，否则为数组 | `string \| number \| (string \| number)[]` | `''`    |
| `accordion`   | 是否手风琴模式                       | `boolean`                                  | `false` |
| `border`      | 是否显示分割线                       | `boolean`                                  | `true`  |

| 子项参数   | 说明                     | 类型               | 默认值  |
| ---------- | ------------------------ | ------------------ | ------- |
| `name`     | 唯一标识，缺省用子项序号 | `string \| number` | `''`    |
| `title`    | 标题                     | `string`           | `''`    |
| `disabled` | 是否禁用                 | `boolean`          | `false` |
| `icon`     | 标题左侧图标名           | `string`           | `''`    |
| `duration` | 展开动画时长（毫秒）     | `number`           | `250`   |
| `border`   | 是否显示分割线           | `boolean`          | `true`  |

### Events

| 事件名              | 说明         | 回调参数                                          |
| ------------------- | ------------ | ------------------------------------------------- |
| `update:modelValue` | 展开值变化   | `value: string \| number \| (string \| number)[]` |
| `change`            | 展开值变化后 | 同上                                              |

### Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| default | 折叠的内容区     |
| title   | 自定义标题       |
| value   | 标题右侧自定义区 |
| icon    | 标题左侧图标     |

## 主题变量

| 变量名                           | 说明         |
| -------------------------------- | ------------ |
| `--snake-collapse-header-height` | 标题行高度   |
| `--snake-collapse-font-size`     | 标题字号     |
| `--snake-collapse-arrow-color`   | 箭头颜色     |
| `--snake-collapse-bg`            | 面板底色     |
| `--snake-collapse-border-color`  | 分割线颜色   |
| `--snake-collapse-max-height`    | 展开最大高度 |

## 注意

- 展开动画用 `max-height` 过渡（默认上限 1000px），内容超长时请调大 `--snake-collapse-max-height`。
- 手风琴与多项模式的 `v-model` 类型不同，切换模式时记得同步改绑定的初始值。
