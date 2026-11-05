---
preview: /pages/componentsA/dropMenu/index
---

# DropMenu 下拉菜单

`DropMenu` 与 `DropMenuItem` 成对使用：容器负责多个菜单项的布局、互斥展开和弹层定位，菜单项提供触发器、遮罩与内容面板。面板打开前会真实测量菜单底部位置，适用于普通布局和吸顶布局。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`DropMenuItem` 必须作为 `DropMenu` 的直接子组件使用，每个菜单项通过 `v-model` 独立绑定选中值：

```vue
<snake-drop-menu @open="onOpen" @close="onClose">
  <snake-drop-menu-item v-model="category" title="分类" :options="categories" />
  <snake-drop-menu-item v-model="sort" title="排序" :options="sorts" />
</snake-drop-menu>
```

## 自定义面板

可以在菜单项默认插槽中放入自定义筛选表单，配合 `beforeToggle` 在展开前校验：

```ts
const beforeToggle = ({ resolve }) => resolve(userHasPermission);
```

```vue
<snake-drop-menu-item title="高级筛选" :before-toggle="beforeToggle">
  <view class="filter-panel">自定义筛选内容</view>
</snake-drop-menu-item>
```

## 吸顶与动态内容

菜单进入吸顶状态、窗口尺寸变化或异步面板内容改变后，调用实例方法 `updateDropMenuRect()` 重新测量面板顶部位置。通过容器实例调用 `open(index)` 可由外部操作打开指定菜单。

```vue
<snake-drop-menu ref="menuRef">
  <snake-drop-menu-item v-model="sort" title="排序" :options="sorts" />
</snake-drop-menu>

<snake-button @click="menuRef?.open(0)">选择排序</snake-button>
```

## API

### DropMenu

#### Props

| 参数               | 说明                                      | 类型         | 默认值         |
| ------------------ | ----------------------------------------- | ------------ | -------------- |
| `activeColor`      | 激活状态的标题颜色                        | `string`     | 主题色         |
| `inactiveColor`    | 未激活状态的标题颜色                      | `string`     | 主题次要文字色 |
| `closeOnClickMask` | 是否允许点击遮罩关闭                      | `boolean`    | `true`         |
| `closeOnClickSelf` | 再次点击已展开标题时是否关闭              | `boolean`    | `true`         |
| `duration`         | 面板动画持续时间，单位 ms                 | `number`     | `300`          |
| `height`           | 标题菜单栏高度，数值按 px（375 稿）处理   | `UnitValue`  | `40`           |
| `borderBottom`     | 是否显示菜单栏底部边框                    | `boolean`    | `false`        |
| `titleSize`        | 标题文字尺寸，数值按 px（375 稿）处理     | `UnitValue`  | `14`           |
| `menuIcon`         | 标题右侧图标名称                          | `string`     | `down`         |
| `menuIconSize`     | 标题右侧图标尺寸，数值按 px（375 稿）处理 | `UnitValue`  | `9`            |
| `zIndex`           | 菜单和弹层层级基准                        | `number`     | `985`          |
| `customClass`      | 根节点自定义类名                          | `string`     | `''`           |
| `customStyle`      | 根节点自定义样式                          | `StyleValue` | `''`           |

#### Events

| 事件名  | 触发时机       | 参数       |
| ------- | -------------- | ---------- |
| `open`  | 某个菜单项展开 | 菜单项索引 |
| `close` | 某个菜单项关闭 | 菜单项索引 |

#### Expose

| 方法                   | 说明                           |
| ---------------------- | ------------------------------ |
| `open(index)`          | 展开指定项                     |
| `close()`              | 关闭当前展开项                 |
| `colseAll()`           | 关闭全部菜单项（保留历史拼写） |
| `highlight(index?)`    | 只高亮指定标题，不展开面板     |
| `updateDropMenuRect()` | 主动重新测量菜单位置           |

### DropMenuItem

#### Props

| 参数           | 说明                                             | 类型                   | 默认值  |
| -------------- | ------------------------------------------------ | ---------------------- | ------- |
| `modelValue`   | 双向绑定的当前值，支持 v-model                   | `unknown`              | -       |
| `title`        | 固定标题；为空时显示选中项 label                 | `string`               | `''`    |
| `options`      | 可选项列表，格式 `{ label, value, disabled? }[]` | `DropMenuOption[]`     | `[]`    |
| `disabled`     | 是否禁用菜单项                                   | `boolean`              | `false` |
| `height`       | 面板最大高度，传 `auto` 表示不限制               | `UnitValue \| 'auto'`  | `auto`  |
| `show`         | 外部强制显示面板                                 | `boolean`              | -       |
| `beforeToggle` | 展开前回调，通过 `resolve(boolean)` 决定是否展开 | `DropMenuBeforeToggle` | -       |
| `customStyle`  | 面板自定义样式                                   | `StyleValue`           | `''`    |

#### Events

| 事件名              | 触发时机     | 参数       |
| ------------------- | ------------ | ---------- |
| `update:modelValue` | 选择可用选项 | 选项 value |
| `change`            | 选择可用选项 | 选项 value |
| `open`              | 面板展开     | -          |
| `close`             | 面板关闭     | -          |

#### Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `default` | 替换自动生成的选项列表 |

## 主题变量

| 变量名                         | 说明                   |
| ------------------------------ | ---------------------- |
| `--snake-color-primary`        | 激活标题和选中项颜色   |
| `--snake-color-text-secondary` | 默认标题及选项文字颜色 |
| `--snake-color-surface`        | 菜单栏和下拉面板背景色 |
| `--snake-color-divider`        | 菜单栏及选项分隔线颜色 |
| `--snake-color-shadow`         | 下拉面板阴影颜色       |
