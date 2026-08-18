# Changelog

## 0.4.1 - 2026-08-18

- 新增 `snake-hotzone` 热区图组件：背景图 `widthFix` 自适应，按百分比渲染装修编辑器配置的热区并点击跳转。
- 内部链接走 `navTo`（自动降级 `switchTab`），外部链接通过注入的 CMS link-service 打开（legacy 宿主由其导向 web-view 页面）。
- `snake-cms` 渲染分发器新增 `hotzone` 内置组件分支，并透传 link-service 与页面信息。

## 0.4.0 - 2026-08-14

- 新增单一 `snake-cms` 门面、公开 CMS 类型、诊断事件和跨端静态扩展插槽。
- 商品、活动、筛选、优惠券和跳转改为 `cms.services` 业务服务注入。
- 新增请求代次保护、明确加载状态、筛选缓存命名空间和重复商品区诊断。
- 标准化视频配置键为 `videos`，继续兼容旧键 `videoss`。
- 将 Joker 接口、路由、审核规则和 CDN 资源隔离到弃用的自动兼容适配器。

## 0.1.0 - 2026-08-11

- 将公开组件统一为 `snake-kebab-case/snake-kebab-case.vue` 目录结构。
- 增加 `<snake-*>` easycom 发现约定。
- 增加模块元数据、具名导出入口和依赖说明。
