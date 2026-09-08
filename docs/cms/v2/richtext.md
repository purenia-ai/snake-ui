# 富文本 `v2.richtext`

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

仅渲染可信编辑器输出；外部 HTML 应在服务端清洗。该区块替代 v1 `richtext` 的 `myValue` 字段。
