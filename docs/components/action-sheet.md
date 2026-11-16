---
preview: /pages/componentsA/actionSheet/index
---

# ActionSheet 动作面板

从底部弹出的动作列表，用于客服、分享、更多操作等低频动作；支持图标、次要说明、禁用、加载与服务端决定的取消文案。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

用 `v-model` 控制显隐，`actions` 描述动作列表，选中后默认自动关闭并派发 `select`：

```vue
<snake-action-sheet v-model="visible" :actions="actions" @select="onSelect" />

<script setup lang="ts">
import { ref } from 'vue';
import type { ActionSheetAction } from '@puresnake/snake-ui';

const visible = ref(false);
const actions: ActionSheetAction[] = [
    { name: '联系客服', icon: 'kefu-ermai' },
    { name: '分享给好友', icon: 'share' },
    { name: '举报', color: 'var(--snake-color-error)' }
];

function onSelect(action: ActionSheetAction, index: number) {
    console.log(action, index);
}
</script>
```

## 标题与说明

`title` 与 `description` 都为空时不渲染头部：

```vue
<snake-action-sheet v-model="visible" title="更多操作" description="选择后立即生效" :actions="actions" />
```

## 禁用与加载

单项的 `disabled` 与 `loading` 都会拦截 `select`。`loading` 会在文字左侧渲染 `snake-loading` 转圈并保留文案，`disabled` 则整行置灰：

```vue
<snake-action-sheet
    v-model="visible"
    :actions="[
        { name: '立即预约', loading: true },
        { name: '暂不开放', disabled: true }
    ]"
/>
```

## 自定义单行

`action-item` 是**行内容**插槽：行容器（点击、禁用拦截、加载拦截、`closeOnClickAction` 关闭）仍由组件负责，只有行内部结构被替换。插槽对每一行都生效，所以只想改某一行时，用 `v-if` 命中它、其余行自己输出默认结构：

```vue
<snake-action-sheet v-model="visible" :actions="actions" @select="onSelect">
    <template #action-item="{ action, index }">
        <!-- 只改第 2 行：加一个价格 -->
        <view v-if="index === 1" class="my-row">
            <text>{{ action.name }}</text>
            <text class="my-row__price">¥99</text>
        </view>
        <!-- 其余行照抄默认结构（与组件内置渲染一致） -->
        <template v-else>
            <snake-icon v-if="action.icon" :name="action.icon" :size="16" :margin-left="0" :margin-right="6" />
            <view class="snake-action-sheet__item-text">
                <view class="snake-action-sheet__item-name">{{ action.name }}</view>
                <view v-if="action.subname" class="snake-action-sheet__item-subname">{{ action.subname }}</view>
            </view>
        </template>
    </template>
</snake-action-sheet>
```

> 不要依赖「插槽返回空内容时自动回落默认渲染」——H5/App 下 Vue 运行时确实会回落，但小程序端 Scoped Slot 编译成原生 `slot`，回落行为不保证一致，请显式写 `v-else`。

如果**所有行**都要换结构，用 `action` 插槽更省事，但它会连行容器一起替换，此时 `select`、`closeOnClickAction`、`disabled`/`loading` 拦截都需要自己处理。

## 不自动关闭

需要连续选择或异步确认时关闭自动关闭，自行控制 `v-model`：

```vue
<snake-action-sheet v-model="visible" :actions="actions" :close-on-click-action="false" @select="handleSelect" />
```

## API

### Props

| 参数                  | 说明                                 | 类型                          | 默认值  |
| --------------------- | ------------------------------------ | ----------------------------- | ------- |
| `customStyle`         | 根节点自定义样式                     | `StyleValue`                  | `''`    |
| `customClass`         | 根节点自定义类名                     | `string`                      | `''`    |
| `modelValue`          | 是否显示面板                         | `boolean`                     | `false` |
| `title`               | 面板标题                             | `string`                      | `''`    |
| `description`         | 标题下方说明                         | `string`                      | `''`    |
| `actions`             | 动作列表                             | `ActionSheetAction[]`         | `[]`    |
| `showCancel`          | 是否显示取消按钮                     | `boolean`                     | `true`  |
| `cancelText`          | 取消按钮文案，缺省读 `common.cancel` | `string`                      | `''`    |
| `closeOnClickAction`  | 点击动作后是否关闭                   | `boolean`                     | `true`  |
| `closeOnClickOverlay` | 点击遮罩是否关闭                     | `boolean`                     | `true`  |
| `round`               | 是否圆角                             | `boolean \| number \| string` | `true`  |
| `safeAreaInsetBottom` | 是否适配底部安全区                   | `boolean`                     | `true`  |
| `zIndex`              | 面板层级                             | `number`                      | `0`     |

### Events

| 事件名              | 说明         | 回调参数                                   |
| ------------------- | ------------ | ------------------------------------------ |
| `update:modelValue` | 面板显隐变化 | `value: boolean`                           |
| `select`            | 选中某个动作 | `action: ActionSheetAction, index: number` |
| `cancel`            | 点击取消按钮 | -                                          |
| `close`             | 面板开始关闭 | -                                          |
| `opened`            | 打开动画结束 | -                                          |

### Slots

| 插槽名        | 说明                                   | 作用域参数          |
| ------------- | -------------------------------------- | ------------------- |
| `action`      | 完全自定义动作区，传入后忽略 `actions` | `{ actions }`       |
| `action-item` | 自定义单行动作内容，行容器与交互保留   | `{ action, index }` |

### Expose

| 方法    | 说明                           |
| ------- | ------------------------------ |
| `open`  | 打开面板，需父级绑定 `v-model` |
| `close` | 关闭面板，需父级绑定 `v-model` |

## 主题变量

| 变量名                             | 说明                 |
| ---------------------------------- | -------------------- |
| `--snake-action-sheet-bg`          | 面板底色             |
| `--snake-action-sheet-panel-bg`    | 动作组之外的面板底色 |
| `--snake-action-sheet-item-height` | 单项最小高度         |
| `--snake-action-sheet-font-size`   | 单项字号             |
| `--snake-action-sheet-title-size`  | 标题字号             |
| `--snake-action-sheet-cancel-gap`  | 取消按钮与列表间距   |

## 注意

- 面板依赖 `snake-popup` 的底部模式，遮罩与滚动锁定由 Popup 负责，不要再嵌套一层 Popup。
- `open` / `close` 只是派发 `update:modelValue`，父级未绑定 `v-model` 时不会生效。
- `loading` 只拦截点击并渲染转圈，不会自动关闭面板；异步结束后需要业务自己把 `loading` 置回 `false` 或调用 `open()`/`close()`。
- 用 `action` 插槽整块替换动作区时，`select` 事件与 `closeOnClickAction` 都不再生效，需要自行派发与关闭。
