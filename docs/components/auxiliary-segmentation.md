---
preview: /pages/componentsB/auxiliary-segmentation
cms: true
---

# 辅助分割线 <span class="cms-badge">CMS</span>
在装修页面中插入留白，或在留白区域中央绘制一条可配置分割线。

## 运行前提

依赖 uni-app 基础组件、`rpx` 和 Snake UI `addUnit` 单位工具。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-auxiliary-segmentation
  :datas="{
    blankHeight: 32,
    paddType: 1,
    bgColor: '#ffffff',
    segmentationtype: 1,
    bordertp: 'dashed',
    auxliarColor: '#d9e3dd',
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 分割区域配置 | `Object` | 未声明 | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `blankHeight` | 区域高度，经 Snake UI `addUnit` 转换 |
| `paddType` | 为 `0` 时无左右内边距，否则为 `15px` |
| `bgColor` | 背景色 |
| `segmentationtype` | 为 `1` 时显示分割线 |
| `bordertp` | CSS `border-top-style` 值 |
| `auxliarColor` | 分割线颜色 |

组件未声明事件和插槽。

## 注意事项

尺寸通过 Snake UI `addUnit` 统一补充单位；数值按当前组件约定转换，字符串可直接带 `rpx`、`px` 或 `%`。

源码：`src/uni_modules/snake-ui/components/snake-auxiliary-segmentation/snake-auxiliary-segmentation.vue`
