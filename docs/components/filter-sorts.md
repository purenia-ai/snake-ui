---
preview: /pages/componentsB/filterSorts/index
cms: true
---

# 筛选排序 <span class="cms-badge">CMS</span>
组合顶部快捷排序、价格排序和多维筛选面板，并向父级输出统一查询参数。

## 运行前提

依赖 Vue `<script setup>`、uni-app 节点与滚动 API，以及包内筛选面板和私有交互组件。默认筛选通过安装 Snake UI 时传入的 `cache` 适配器保存。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-filter-sorts
  :filters="filters"
  sort="auto"
  bg-color="#ffffff"
  :show-tabs="true"
  :scroll-top="scrollTop"
  @change="handleFilterChange"
/>
```

```js
const filters = {
  topFilter: [
    { name: '综合', type: 'click', value: 'auto' },
    { name: '价格', type: 'sort', value: 'price' },
  ],
  mainFilter: [
    {
      name: '尺码',
      value: 'sizeFilter',
      type: 'multiple',
      list: [{ name: '42', value: '42' }],
    },
  ],
  brandFilter: {},
}
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `filters` | 顶部排序、主筛选和品牌数据 | `Object` | `{}` | - |
| `defaultFilter` | 已声明但当前顶层逻辑未使用 | `Object` | `{}` | - |
| `bgColor` | 顶部区域背景色 | `String` | `'transparent'` | - |
| `sort` | 挂载后写入的初始排序值 | `String` | `''` | - |
| `showTabs` | 计算打开面板时的页面滚动偏移 | `Boolean` | `true` | - |
| `goodsListLength` | 已声明但当前逻辑未使用 | `Number` | `0` | - |
| `customStyle` | 合并到最外层的样式对象 | `Object` | `{}` | - |
| `scrollTop` | 传给内部筛选面板 | `Number` | `0` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `change` | 排序或筛选确认后 | `filterParams`，包含 `sort`、`price` 及筛选字段 |

## 筛选数据

- `topFilter` 控制顶部项；`type` 为 `click` 或 `sort`。
- `mainFilter` 控制筛选类别，每项使用 `name`、`value`、`type`、`list`，并可包含说明字段。
- `brandFilter` 是按 `hot`、字母和 `#` 分组的对象。
- 内部面板把多选值用逗号连接，并可将默认选择缓存 48 小时。

## 注意事项

内部下拉菜单方法名按现有接口调用为 `colseAll`。H5 打开筛选面板时会修改 `document.body.style.overflow`；SSR 文档不执行该组件。

源码：`src/uni_modules/snake-ui/components/snake-filter-sorts/snake-filter-sorts.vue`、`src/uni_modules/snake-ui/components/snake-filter-sorts/filter-page.vue`
