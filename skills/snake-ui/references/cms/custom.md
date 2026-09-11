---
name: 'custom'
description: 'Snake UI 自定义模块参考。处理 custom、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['custom', '自定义模块']
---

# 自定义模块

用命名插槽把区块交给宿主应用渲染。

## 完整信封

```ts
{
    component: 'v2.custom', text: '自定义模块', type: '3-8', active: true,
    props: { slotName: 'member-card' }
}
```

```vue
<snake-cms :page-components="components">
  <template #member-card="{ item }">
    <member-card :config="item.props" />
  </template>
</snake-cms>
```

## Props

| 字段       | 类型     | 默认值     | 说明         |
| ---------- | -------- | ---------- | ------------ |
| `slotName` | `string` | `'custom'` | 宿主命名插槽 |

插槽名应来自受控编辑器配置，不要把它当成动态组件名称。
