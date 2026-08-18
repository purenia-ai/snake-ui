# 组件数据约定

## `datas` 配置对象

多数展示组件将复杂配置集中在名为 `datas` 的对象 Prop 中。字段由页面装修数据直接驱动：

```js
const componentConfig = {
  component: 'notice',
  setStyle: {
    direction: 'row',
    noticeText: '今日上新',
    textList: [],
    backColor: '#f2fff8',
    textColor: '#133b2b',
    pageMargin: 24,
  },
}
```

文档按组件列出源码读取的字段。调用方仍应在接口层验证数据，特别是数组索引、嵌套对象、颜色、尺寸和跳转地址。

## CMS 页面数据

`snake-cms` 接收两组主要数据：

| 参数 | 作用 |
| --- | --- |
| `pageInfo` | 页面标识、页面级配置和业务查询上下文 |
| `pageComponents` | 按顺序排列的装修组件配置 |

`pageComponents` 的基本形态如下：

```js
const pageComponents = [
  {
    component: 'images',
    setStyle: {
      src: 'https://example.com/banner.png',
      url: '/pages/activity/index',
    },
  },
]
```

## 事件命名

现有源码的事件命名并未完全统一，例如同时存在 `item-click` 和 `handlerOffer`。文档保留源码中的实际名称，调用时不要自行转换大小写。

## 防御性处理

当前部分组件会直接读取深层字段或数组。接入方应在传值前补齐稳定的默认结构：

```js
const safeDatas = {
  textList: [],
  imageList: [],
  tabslist: [],
  ...apiDatas,
}
```

这类默认值应放在业务数据适配层，不建议在多个页面中重复拼装。

## 数据来源

装修数据由 SankeEditor 编辑器产出并经后端存储，字段契约与组件标识对照见[装修编辑器数据对接](./sanke-editor.md)。
