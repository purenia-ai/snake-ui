---
preview: /pages/componentsA/navbar/index
---

# Navbar 导航栏

用于页面顶部导航，支持状态栏安全区、返回操作、固定定位、标题及左右插槽。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-navbar title="订单详情" />
```

自定义右侧操作：

```vue
<snake-navbar title="消息" :custom-back="handleBack">
    <template #right><text>更多</text></template>
</snake-navbar>
```

## API

### Props

| 参数                                                    | 说明                       | 类型                        | 默认值                           |
| ------------------------------------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| `title`                                                 | 中间标题                   | `string`                    | `''`                             |
| `height`                                                | 导航内容高度，单位 px      | `string \| number`          | `44`                             |
| `isBack`                                                | 是否显示返回按钮           | `boolean`                   | `true`                           |
| `backIconName` / `backIconColor` / `backIconSize`       | 返回图标名称、颜色和尺寸   | 组合类型                    | `arrow-left` / 主题文字色 / `40` |
| `backText` / `backTextStyle`                            | 返回辅助文字及样式         | 组合类型                    | `''`                             |
| `titleWidth` / `titleColor` / `titleSize` / `titleBold` | 标题宽度、颜色、字号和字重 | 组合类型                    | 主题默认值                       |
| `background`                                            | 导航栏背景样式或颜色       | `string \| object \| array` | 白色表面背景                     |
| `fixed` / `immersive`                                   | 固定顶部及是否允许内容沉浸 | `boolean`                   | `true` / `false`                 |
| `safeAreaInsetTop`                                      | 是否包含状态栏安全区       | `boolean`                   | `true`                           |
| `borderBottom`                                          | 是否显示底部分隔线         | `boolean`                   | `true`                           |
| `zIndex`                                                | 固定定位层级               | `string \| number`          | `980`                            |
| `customBack`                                            | 自定义返回处理             | `() => void`                | `null`                           |
| `customClass` / `customStyle`                           | 自定义类名和样式           | 组合类型                    | `''`                             |

### Slots

| 插槽      | 说明                   |
| --------- | ---------------------- |
| `left`    | 返回区域后的左侧内容   |
| `default` | 未设置标题时的中间内容 |
| `right`   | 右侧操作内容           |

### Events

| 事件名 | 触发时机       | 参数    |
| ------ | -------------- | ------- |
| `back` | 点击返回区域时 | `event` |

## 主题变量

| 变量名                  | 说明                 |
| ----------------------- | -------------------- |
| `--snake-color-text`    | 返回图标与标题默认色 |
| `--snake-color-surface` | 导航栏默认背景色     |
| `--snake-color-divider` | 底部分隔线颜色       |

源码：`src/uni_modules/snake-ui/components/snake-navbar/snake-navbar.vue`
