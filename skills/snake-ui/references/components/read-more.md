---
name: 'read-more'
description: 'Snake UI ReadMore 阅读更多参考。处理 read-more、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['read-more', 'snake-read-more', 'ReadMore', '阅读更多']
---

# ReadMore 阅读更多

用于内容较长时预先收起一部分、点击展开全部内容的场景，超出占位高度才显示展开按钮。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-read-more :show-height="400">
  <rich-text :nodes="content" />
</snake-read-more>
```

## 展开与收起

```vue
<snake-read-more toggle close-text="展开阅读全文" open-text="收起">
  <text>长内容……</text>
</snake-read-more>
```

`toggle` 为 true 时，展开后显示收起按钮；内容动态变化后可通过 `ref.init()` 重新测量高度。

异步富文本、图片加载完成或语言切换后都可能改变高度，应在内容更新后的 `nextTick` 调用 `init()`；不要用固定字符数代替高度测量。

## API

### Props

| 参数                          | 说明                           | 类型                        | 默认值                    |
| ----------------------------- | ------------------------------ | --------------------------- | ------------------------- |
| `showHeight`                  | 显示占位高度，数值按 rpx 处理  | `number \| string`          | `400`                     |
| `toggle`                      | 展开后是否显示收起按钮         | `boolean`                   | `false`                   |
| `closeText`                   | 收起状态的提示文字             | `string`                    | 语言包默认值              |
| `openText`                    | 展开状态的提示文字             | `string`                    | 语言包默认值              |
| `color`                       | 提示文字颜色                   | `string`                    | `--snake-color-primary`   |
| `fontSize`                    | 提示文字大小，数值按 rpx 处理  | `number \| string`          | `28`                      |
| `shadowStyle`                 | 收起时覆盖在内容底部的阴影样式 | `object \| array`           | 渐隐到 surface 的默认阴影 |
| `textIndent`                  | 段落首行缩进                   | `string`                    | `2em`                     |
| `index`                       | open/close 事件回调中的标识值  | `number \| string`          | `''`                      |
| `customClass` / `customStyle` | 自定义类名和样式               | `string \| object \| array` | `''`                      |

### Events

| 事件名  | 触发时机 | 参数    |
| ------- | -------- | ------- |
| `open`  | 展开     | `index` |
| `close` | 收起     | `index` |

### Methods

| 方法名 | 说明                           |
| ------ | ------------------------------ |
| `init` | 重新测量内容高度并刷新展开状态 |

### Slots

| 插槽名    | 说明             |
| --------- | ---------------- |
| `default` | 需要折叠的长内容 |

## 主题变量

| 变量名                         | 说明                 |
| ------------------------------ | -------------------- |
| `--snake-color-primary`        | 展开和收起按钮颜色   |
| `--snake-color-surface`        | 收起状态渐隐终点颜色 |
| `--snake-color-text-secondary` | 正文默认颜色         |
