---
preview: /pages/componentsB/richText/index
cms: true
---

# 富文本 <span class="cms-badge">CMS</span>
使用 `mp-html` 渲染 CMS 提供的 HTML 内容。

## 运行前提

宿主工程需要注册 `mp-html` 组件，并确认输入 HTML 的来源可信或已完成安全清洗。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-rich-text :datas="{ myValue: '<p>商品详情内容</p>' }" />
```

## 效果图

<div class="component-preview"><span class="component-preview__label">效果图取决于传入 HTML</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | `Object \| null` | `{}` | 富文本配置 |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `myValue` | 传给 `mp-html` 的 HTML 内容 |

组件未声明事件和插槽。

## 注意事项

- 组件不会自行净化 HTML；安全策略由数据生产方和 `mp-html` 配置负责。
- 脚本中存在 `tagStyle` 数据，但当前模板没有传给 `mp-html`。
- 外层固定使用 `20rpx` 水平内边距。

源码：`src/uni_modules/snake-ui/components/snake-rich-text/snake-rich-text.vue`
