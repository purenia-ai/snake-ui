---
preview: /pages/componentsB/list-switching
cms: true
---

# 列表切换 <span class="cms-badge">CMS</span>
提供多种商品列表布局、分类切换、角标和购买按钮样式，是一个配置面较大的复合展示组件。

## 运行前提

依赖 uni-app 基础组件、`uni.$snake.navTo`、包内 `tree-select`，以及组件自带图标、字体和工具类样式。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-list-switching
  :datas="{
    commoditylisttype: 0,
    commodityType: 0,
    pageMargin: 20,
    commodityMargin: 16,
    borderRadius: 12,
    imageList: [],
    commoditylisttypetab: [],
    commoditycorner: true,
    commoditycornertype: 0,
    commodityTagColor: '#06D290',
    tagPosition: 0,
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 布局、商品和样式配置 | `Object` | 未声明 | - |

### 主要 `datas` 字段

| 类别 | 字段 |
| --- | --- |
| 布局 | `commoditylisttype`、`commodityType`、`positions`、`pageMargin`、`commodityMargin`、`borderRadius`、`bgImg` |
| 数据 | `imageList`、`commoditylisttypetab` |
| 角标 | `commoditycorner`、`commoditycornertype`、`commodityTagColor`、`tagPosition` |
| 文案与价格 | `moditystyle`、`textWeight`、`priceofcommodity` |
| 购买入口 | `purchase`、`purchasebutton`、`purchasebuttonType`、`showMore` |
| Tab | `tabColor` |

组件未向父级发送事件。商品点击会直接导航至 `/pages/buy/detail?goodsInfoId=...`。

## 内部 Tree Select

侧栏子组件接收 `items` 和 `current`，使用名为 `content` 的插槽显示右侧内容，并在切换时发送 `click-nav(item, index)`。列表切换组件在内部消费该事件。

## 注意事项

- 图片 URL 会被追加 OSS `ys` 或 `baidi` 样式参数。
- 角标定位只监听 `tagPosition` 和 `commoditycornertype`；运行时修改其他角标颜色字段不一定立即重算。
- 源码存在 `this.datastagColor` 回退引用，但没有对应数据字段；建议始终提供 `commodityTagColor`。
- 该组件模板分支较多，调用方应保存一套经过目标平台验证的完整默认配置。

源码：`src/uni_modules/snake-ui/components/snake-list-switching/snake-list-switching.vue`、`src/uni_modules/snake-ui/components/snake-list-switching/components/tree-select/index.vue`
