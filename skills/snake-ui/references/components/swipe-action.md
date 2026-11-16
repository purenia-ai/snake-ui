---
name: 'swipe-action'
description: 'Snake UI SwipeAction 滑动操作参考。处理 swipe-action、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['swipe-action', 'snake-swipe-action', 'SwipeAction', '滑动操作']
---

# SwipeAction 滑动操作

列表项左滑露出右侧按钮、右滑露出左侧按钮，用于删除、收藏、取消订单；横向手势由组件接管，纵向手势仍交给页面滚动。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

用 `actions` 描述右侧按钮，点击后派发 `click(action, side, index)`，默认点击即收起：

```vue
<snake-swipe-action :actions="actions" @click="onAction">
    <snake-cell-item title="订单 202611110001" value="待付款" arrow />
</snake-swipe-action>

<script setup lang="ts">
import type { SwipeActionItem } from '@puresnake/snake-ui';

const actions: SwipeActionItem[] = [
    { text: '收藏', type: 'primary' },
    { text: '取消订单', type: 'error' }
];

function onAction(action: SwipeActionItem, side: 'left' | 'right', index: number) {
    console.log(action.text, side, index);
}
</script>
```

## 左右双向

`leftActions` 用于右滑露出的左侧按钮，`side` 会告诉回调命中的是哪一侧：

```vue
<snake-swipe-action :actions="actions" :left-actions="leftActions">
    <snake-cell-item title="消息中心" value="2 条未读" arrow />
</snake-swipe-action>

<script setup lang="ts">
const actions: SwipeActionItem[] = [{ text: '删除', type: 'error' }];
const leftActions: SwipeActionItem[] = [{ text: '标为已读', type: 'warning' }];
</script>
```

## 语义色与图标

`type` 决定缺省背景色，`color` 可覆盖；`icon` 放在文字上方，图标颜色与文字一致：

```vue
<snake-swipe-action
    :actions="[
        { text: '置顶', type: 'warning', icon: 'arrow-up' },
        { text: '删除', type: 'error', icon: 'trash' }
    ]"
/>
```

## 自定义按钮区

需要任意宽度的按钮（两行文案、纯图标、特殊配色）时用插槽：

- `#actions` 替换右侧按钮区，`#left` 替换左侧按钮区；
- 插槽里的按钮宽度由内容决定，组件会实测后按实测值展开；
- 点击按钮区任意位置都会收起，作用域参数 `close` 可主动收起。

```vue
<snake-swipe-action>
    <snake-cell-item title="运费险说明" value="保障中" />
    <template #left>
        <view class="my-action my-action--left" @click="onPin">置顶</view>
    </template>
    <template #actions="{ close }">
        <view class="my-action" @click="onRead(close)">标为已读</view>
        <view class="my-action my-action--error" @click="close">删除</view>
    </template>
</snake-swipe-action>
```

自定义按钮只需负责铺满高度（默认已被拉伸到整行高），无需自己写 `height`。

## 受控展开

`v-model` 绑定停留状态，取值 `'close' | 'left' | 'right'`；手势引起的状态变化也会同步回去：

```vue
<snake-swipe-action v-model="openSide" :actions="actions" :left-actions="leftActions">
    <snake-cell-item title="订单 202611110001" :value="openSide" />
</snake-swipe-action>

<snake-button text="展开左侧" @click="openSide = 'left'" />
<snake-button text="收起" @click="openSide = 'close'" />

<script setup lang="ts">
import type { SwipeActionStatus } from '@puresnake/snake-ui';

const openSide = ref<SwipeActionStatus>('close');
</script>
```

也可以直接调实例方法，效果等价：

```vue
<snake-swipe-action ref="swipeRef" :actions="actions" />

<script setup lang="ts">
const swipeRef = ref();
swipeRef.value?.open(); // 展开右侧；传 'left' 展开左侧
swipeRef.value?.close();
</script>
```

## 关闭前拦截

`beforeClose` 在收起前调用，参数为触发原因（`'swipe' | 'click' | 'value'`）与当前展开的一侧。**必须明确放行**：同步返回 `true`，或返回 resolve 为 `true` 的 Promise；返回 `false`、不返回值或抛错都会保持展开。

```vue
<snake-swipe-action :actions="actions" :before-close="beforeClose" />

<script setup lang="ts">
import type { SwipeActionReason, SwipeActionSide } from '@puresnake/snake-ui';

function beforeClose(reason: SwipeActionReason, position: SwipeActionSide): Promise<boolean> {
    if (reason !== 'click') return Promise.resolve(true);
    return new Promise(resolve => {
        uni.showModal({
            title: '确认取消订单？',
            success: result => resolve(Boolean(result.confirm)),
            fail: () => resolve(false)
        });
    });
}
</script>
```

## 同组互斥

`autoClose`（默认开启）保证同一时刻只有一项停留在展开态：按住任意一行、或某一项展开时，其他已展开项都会收起。需要多行同时展开时关掉它。

## API

### Props

| 参数          | 说明                                 | 类型                           | 默认值    |
| ------------- | ------------------------------------ | ------------------------------ | --------- |
| `actions`     | 右侧按钮配置                         | `SwipeActionItem[]`            | `[]`      |
| `leftActions` | 左侧按钮配置                         | `SwipeActionItem[]`            | `[]`      |
| `modelValue`  | 停留状态，支持 v-model               | `'close' \| 'left' \| 'right'` | `'close'` |
| `disabled`    | 是否禁用滑动                         | `boolean`                      | `false`   |
| `autoClose`   | 展开时是否收起同组其他已展开项       | `boolean`                      | `true`    |
| `threshold`   | 判定停留的最小位移，0 为按钮区一半   | `number`                       | `0`       |
| `duration`    | 回弹动画时长（毫秒）                 | `number`                       | `300`     |
| `buttonWidth` | 单个按钮宽度（px，375 稿）           | `number`                       | `80`      |
| `beforeClose` | 关闭前拦截器，返回 `true` 才继续关闭 | `SwipeActionBeforeClose`       | -         |
| `customStyle` | 根节点自定义样式                     | `StyleValue`                   | `''`      |
| `customClass` | 根节点自定义类名                     | `string`                       | `''`      |

`SwipeActionItem` 字段：

| 字段        | 说明           | 类型                                                       | 默认值      |
| ----------- | -------------- | ---------------------------------------------------------- | ----------- |
| `text`      | 按钮文字，必填 | `string`                                                   | -           |
| `type`      | 语义类型       | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` |
| `color`     | 按钮背景色     | `string`                                                   | 语义色      |
| `textColor` | 文字与图标颜色 | `string`                                                   | `'#ffffff'` |
| `icon`      | 图标名         | `string`                                                   | -           |
| `disabled`  | 是否禁用       | `boolean`                                                  | `false`     |
| `autoClose` | 点击后是否收起 | `boolean`                                                  | `true`      |

### Events

| 事件名              | 说明                                       | 回调参数                                                          |
| ------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `click`             | 点击操作按钮                               | `action: SwipeActionItem, side: 'left' \| 'right', index: number` |
| `open`              | 展开后                                     | `side: 'left' \| 'right'`                                         |
| `close`             | 收起后                                     | `side: 'left' \| 'right'`（收起前展开的一侧）                     |
| `contentClick`      | 收起态点击内容区；展开态点击只收起，不派发 | -                                                                 |
| `update:modelValue` | 停留状态变化                               | `value: 'close' \| 'left' \| 'right'`                             |

### Slots

| 插槽名    | 说明             | 作用域参数  |
| --------- | ---------------- | ----------- |
| default   | 被滑动的整条内容 | -           |
| `left`    | 自定义左侧按钮区 | `{ close }` |
| `actions` | 自定义右侧按钮区 | `{ close }` |

传了插槽就会忽略同侧的 `leftActions` / `actions` 配置。

### Expose

| 方法      | 说明                                     |
| --------- | ---------------------------------------- |
| `open`    | 展开指定侧边，不传时优先展开右侧         |
| `close`   | 收起按钮区                               |
| `refresh` | 重新测量左右按钮区宽度（插槽内容变化后） |

## 主题变量

| 变量名                           | 说明         | 默认值        |
| -------------------------------- | ------------ | ------------- |
| `--snake-swipe-action-font-size` | 按钮字号     | `14px`        |
| `--snake-swipe-action-icon-size` | 按钮图标字号 | `16px`        |
| `--snake-swipe-action-bg`        | 内容区底色   | `transparent` |

## 注意

- 按钮区是**实测宽度**：props 配置按 `按钮数 × buttonWidth` 推导，插槽按钮在挂载后与手势开始时实测。插槽内容宽度在运行时变化且没有交互时可能滞后，可调用 `refresh()`。
- 展开态点击内容区会被拦下并收起，但内容区自身子节点的点击回调已经执行，需要阻止进详情页时请在业务侧判断。
- 手势做了方向锁定：横向位移大于纵向才接管，放在纵向 `scroll-view` 内不会抢滚动。
- `beforeClose` 返回 `false` 时，手势回弹会停在展开态，不派发 `close`。
