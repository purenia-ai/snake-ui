---
preview: /pages/componentsA/drop-menu
---

# DropMenu 下拉菜单

负责多个 `DropMenuItem` 的布局、互斥展开和弹层定位。面板打开前会真实测量菜单底部位置，适用于普通布局和吸顶布局。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-drop-menu @open="onOpen" @close="onClose">
  <snake-drop-menu-item v-model="category" title="分类" :options="categories" />
  <snake-drop-menu-item v-model="sort" title="排序" :options="sorts" />
</snake-drop-menu>
```

也可以在菜单项默认插槽中放入自定义筛选表单。

## API

### Props

| 参数                                      | 说明                 | 类型                        | 默认值               |
| ----------------------------------------- | -------------------- | --------------------------- | -------------------- |
| `activeColor` / `inactiveColor`           | 激活和默认标题颜色   | `string`                    | 主题色 / 正文色      |
| `closeOnClickMask`                        | 点击遮罩关闭         | `boolean`                   | `true`               |
| `closeOnClickSelf`                        | 再次点击当前标题关闭 | `boolean`                   | `true`               |
| `duration`                                | 面板动画时长，ms     | `number`                    | `300`                |
| `height`                                  | 菜单栏高度           | `string \| number`          | `40`                 |
| `borderBottom`                            | 是否显示底边         | `boolean`                   | `false`              |
| `titleSize` / `menuIcon` / `menuIconSize` | 标题字号、图标和尺寸 | `string \| number`          | `14` / `down` / `13` |
| `zIndex`                                  | 菜单和弹层层级基准   | `number`                    | `985`                |
| `customClass` / `customStyle`             | 自定义类名和样式     | `string \| object \| array` | `''`                 |

### Events

| 事件名  | 触发时机       | 参数       |
| ------- | -------------- | ---------- |
| `open`  | 某个菜单项展开 | 菜单项索引 |
| `close` | 某个菜单项关闭 | 菜单项索引 |

### Expose

| 方法                     | 说明                              |
| ------------------------ | --------------------------------- |
| `open(index)`            | 展开指定项                        |
| `close()` / `colseAll()` | 关闭当前项；colseAll 保留历史拼写 |
| `highlight(index?)`      | 只高亮指定标题，不展开面板        |
| `updateDropMenuRect()`   | 主动重新测量菜单位置              |

源码：`src/uni_modules/snake-ui/components/snake-drop-menu/snake-drop-menu.vue`
