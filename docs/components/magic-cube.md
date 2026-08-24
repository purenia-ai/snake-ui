---
preview: /pages/componentsB/magicCube/index
cms: true
---

# 魔方布局 <span class="cms-badge">CMS</span>
按照预设类型将多张图片组合成 CMS 魔方区域，并支持按星期和每日时间段筛选素材。

## 运行前提

依赖 Snake UI 单位换算、uni-app 图片与布局能力，并在部分配置中复用轮播广告组件。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-magic-cube
  :datas="{
    rubiksCubeType: 1,
    heights: 360,
    pageMargin: 20,
    imgMargin: 8,
    borderRadius: 12,
    bgColor: '#ffffff',
    imageTypeObj: {
      imageList: [
        { src: 'https://example.com/cube-1.png', url: '/pages/activity/one' },
      ],
    },
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 魔方类型、尺寸和素材配置 | `Object` | 未声明 | - |

### 主要 `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `rubiksCubeType` | 选择模板中的魔方布局分支 |
| `imageTypeObj` | 当前布局使用的图片配置对象 |
| `heights` | 整体高度，经 Snake UI 单位换算处理 |
| `topHeight`、`topHeights` | 部分上下分区布局的比例 |
| `pageMargin`、`imgMargin`、`borderRadius` | 页面边距、图片间距和圆角 |
| `bgColor` | 背景色 |
| `rowNum`、`interval` | 部分轮播/行布局配置 |

### 素材时间规则

图片分组可提供 `weeks`，使用 `1` 至 `7` 表示星期一至星期日。分组下的 `imageList` 项若包含 `startTime` 和 `endTime`，组件只在当天对应时间段内展示。

组件未声明事件和插槽；图片跳转行为由模板分支及复用的轮播组件处理。

## 注意事项

- 时间过滤使用设备本地时间，并将素材时间的时分秒套用到当天。
- 同时缺少开始或结束时间的嵌套素材不会进入定时展示列表。
- 布局类型对应固定模板，`imageTypeObj` 的嵌套结构应与后台装修配置保持一致。

源码：`src/uni_modules/snake-ui/components/snake-magic-cube/snake-magic-cube.vue`
