---
preview: /pages/componentsA/verificationCode/index
description: 使用 Snake UI VerificationCode 维护验证码倒计时文案与状态，界面由宿主自由组合。
---

# VerificationCode 验证码倒计时

无 UI 状态组件：只维护 `canGetCode` 与倒计时文案，通过 `change` 事件把"获取验证码 / 59s后重新获取 / 重新获取"交给页面渲染，按钮、文字链等展示形态由宿主自由组合。

## 使用建议

按钮的禁用状态绑定 `canGetCode`，文案绑定 `change` 的返回值；实际发送验证码的请求由宿主在调用 `start()` 前自行完成。多个页面或多个倒计时同时存在时，用 `uniqueKey` 区分存储。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<template>
    <snake-button size="small" plain :disabled="!canGet" @click="getCode">
        {{ codeText }}
    </snake-button>
    <snake-verification-code ref="codeRef" :seconds="60" @change="codeText = $event" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VerificationCodeExpose } from '@puresnake/snake-ui';

const codeRef = ref<VerificationCodeExpose>();
const codeText = ref('');
const canGet = computed(() => Boolean(codeRef.value?.canGetCode));

async function getCode() {
    // 先发送验证码请求，成功后再开始倒计时
    await sendSms();
    codeRef.value?.start();
}
</script>
```

`start()` 在倒计时进行中调用无效，无需额外防抖。倒计时自然结束或调用 `reset()` 后恢复可获取状态。

## 跨页面续跑

`keepRunning` 开启后，倒计时的截止时间戳会存入本地存储；页面返回再进入或 H5 刷新时自动恢复剩余秒数。多个倒计时用 `uniqueKey` 区分。

## API

### Props

| 参数          | 说明                                                                             | 类型               | 默认值       |
| ------------- | -------------------------------------------------------------------------------- | ------------------ | ------------ |
| `seconds`     | 倒计时时长，单位秒                                                               | `number \| string` | `60`         |
| `startText`   | 开始前文案，未设置时使用语言包默认值                                             | `string`           | 语言包默认值 |
| `changeText`  | 倒计时进行中文案，其中的 `x` 或 `X` 会被替换为剩余秒数，未设置时使用语言包默认值 | `string`           | 语言包默认值 |
| `endText`     | 倒计时结束文案，未设置时使用语言包默认值                                         | `string`           | 语言包默认值 |
| `keepRunning` | 页面离开或刷新后再次进入时是否继续剩余倒计时                                     | `boolean`          | `false`      |
| `uniqueKey`   | `keepRunning` 时区分多个倒计时的存储键后缀                                       | `string`           | `''`         |

### Events

| 事件名   | 说明                       | 参数           |
| -------- | -------------------------- | -------------- |
| `change` | 挂载时和倒计时期间每秒触发 | `text: string` |
| `start`  | 开始倒计时触发             | -              |
| `end`    | 倒计时结束触发             | -              |

### Methods

组件实例暴露以下方法（通过 `ref` 调用）：

| 名称         | 说明                             | 返回值 |
| ------------ | -------------------------------- | ------ |
| `start()`    | 开始倒计时，进行中调用无效       | -      |
| `reset()`    | 重置倒计时并恢复可获取状态       | -      |
| `canGetCode` | 是否可以获取验证码（响应式状态） | -      |

## 主题变量

VerificationCode 为无 UI 状态组件，不引入独立主题变量；文案样式由宿主元素控制。

## 类型定义

```ts
import type { VerificationCodeProps, VerificationCodeEmits, VerificationCodeExpose } from '@puresnake/snake-ui';
```
