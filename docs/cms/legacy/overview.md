# v1 旧版兼容

CMS v1 只用于维护历史页面，新项目请使用 [CMS v2](/cms/v2/overview)。v1 已冻结，不再增加编辑器能力；仅接受兼容性和严重缺陷修复。

## v1 信封

```ts
{
    id: 'legacy-notice',
    component: 'notice',
    visible: true,
    setStyle: {
        noticeText: '历史公告',
        showComponent: true
    }
}
```

- `visible === false` 或 `setStyle.showComponent === false` 时跳过。
- 旧键 `videoss` 通过 alias 规范化为 `videos`。
- `normalizers` 可在渲染前修正宿主特有的历史字段。
- 已配置旧 `request` 且没有新 services 时，`legacy: 'auto'` 会启用 Joker adapter。

## 与 v2 共存

v1 和 v2 可以在同一 `pageComponents` 中混排，数据各自保留 `setStyle` 或 `props`。不要把 v2 转换为 v1；新版轮播、魔方和商品楼层存在无法无损映射的字段。

页面只允许一个商品楼层，`goodslist` 与 `v2.goodslist` 混排时保留第一个，其余产生 `duplicate-commerce-section` 诊断。

## 维护建议

- 老项目保持当前接口返回，不要求立即迁移数据库。
- 新建和重新装修的页面保存 v2。
- 宿主逐步移除本地 CMS 容器，统一使用 Snake UI 的 `snake-cms`。
- 移除 v1 前先统计线上数据和宿主用量，不按固定版本强制删除。

旧组件入口见 [v1 组件索引](/cms/legacy/components)。
