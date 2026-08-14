---
preview: /pages/componentsA/drop-menu
---

# DropMenu 下拉菜单

协调多个 `DropMenuItem`，保证同一时间只展开一个菜单项。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-drop-menu>
  <snake-drop-menu-item title="分类">分类内容</snake-drop-menu-item>
  <snake-drop-menu-item title="排序">排序内容</snake-drop-menu-item>
</snake-drop-menu>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `customStyle` | 容器行内样式 | `string \| object` | `''` | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 下拉菜单项 |

### Expose

| 名称 | 说明 |
| --- | --- |
| `updateDropMenuRect()` | 兼容旧调用，普通流布局会自动更新 |
| `colseAll()` | 关闭全部菜单项，保留历史拼写 |

源码：`src/uni_modules/snake-ui/components/snake-drop-menu/snake-drop-menu.vue`
