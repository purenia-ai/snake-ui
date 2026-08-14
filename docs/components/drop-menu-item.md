---
preview: /pages/componentsA/drop-menu-item
---

# DropMenuItem 下拉菜单项

提供菜单触发器和内容面板，必须放在 `DropMenu` 内使用。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-drop-menu>
  <snake-drop-menu-item title="全部分类" @close="onClose">筛选内容</snake-drop-menu-item>
</snake-drop-menu>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `title` | 菜单标题 | `string` | `''` | - |
| `beforeToggle` | 展开前置回调，通过 `resolve(boolean)` 决定是否展开 | `function` | - | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `close` | 已展开面板关闭后 | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 面板内容 |

源码：`src/uni_modules/snake-ui/components/snake-drop-menu-item/snake-drop-menu-item.vue`
