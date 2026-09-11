---
name: 'richtext'
description: 'Snake UI 富文本参考。处理 richtext、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['richtext', '富文本']
---

# 富文本

渲染编辑器保存的 HTML 图文内容。

## 完整信封

```ts
{
    component: 'v2.richtext', text: '富文本', type: '3-10', active: true,
    props: { content: '<p>品牌故事</p>', style: { backgroundColor: '#FFFFFF' } }
}
```

## Props

| 字段                    | 类型     | 默认值      | 说明      |
| ----------------------- | -------- | ----------- | --------- |
| `content`               | `string` | `''`        | HTML 内容 |
| `style.backgroundColor` | `string` | `'#FFFFFF'` | 背景颜色  |

仅渲染可信编辑器输出；外部 HTML 应在服务端清洗。
