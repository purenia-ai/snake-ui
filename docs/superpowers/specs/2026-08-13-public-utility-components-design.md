# Snake UI 内部组件公开化设计

## 目标

将 `components/_internal` 中的五个筛选辅助组件升级为正式公共组件，使它们能够通过 easycom 和 npm 命名导入独立使用，并在 Snake UI 的组件总览、VitePress 文档及手机预览中提供入口。

公开组件包括：

- `snake-button-sort`
- `snake-drop-menu`
- `snake-drop-menu-item`
- `snake-index-list`
- `snake-index-anchor`

本次保持组件现有交互语义，不重做筛选业务逻辑，也不改变 `snake-filter-sorts` 的对外 API。

## 目录与依赖

五个目录从 `components/_internal/snake-*` 平移到 `components/snake-*`。`snake-filter-sorts` 和 `filter-page` 改为引用新位置，迁移完成后删除空的 `_internal` 目录。

`snake-drop-menu` 与 `snake-drop-menu-item` 继续通过 `libs/internal/drop-menu.ts` 的 InjectionKey 通讯；`snake-index-list` 与 `snake-index-anchor` 继续通过 `libs/internal/index-list.ts` 通讯。这里的 `libs/internal` 是组件内部实现协议，不作为用户直接调用的公共 API。

## 公共 API

每个组件新增独立 `types.ts`，SFC 使用类型化的 `defineProps` 和 `defineEmits`：

- `SnakeButtonSortProps`: `title?: string`
- `SnakeButtonSortEmits`: `change({ value: '' | 'asc' | 'desc' })`
- `SnakeDropMenuProps`: `customStyle?`
- `SnakeDropMenuExpose`: `updateDropMenuRect()`、`colseAll()`；保留现有拼写以兼容调用
- `SnakeDropMenuItemProps`: `title?: string`、`beforeToggle?: callback`
- `SnakeDropMenuItemEmits`: `close()`
- `SnakeIndexListProps`: `indexList?: string[]`、`activeColor?: string`、`inactiveColor?: string`
- `SnakeIndexAnchorProps`: `index: number`、`text?: string`、`customStyle?`

组件分别以 `SnakeButtonSort`、`SnakeDropMenu`、`SnakeDropMenuItem`、`SnakeIndexList`、`SnakeIndexAnchor` 从 npm 根入口导出，相关类型同时从根入口和 `snake-ui/types` 导出。

## 文档与演示

五个组件归入“导航与布局”类别，并各自拥有：

- VitePress 组件文档，包含基础用法、API、事件、插槽和平台说明；
- uni-app 示例路由；
- 手机预览渲染分支；
- 至少一项可交互演示配置；
- 组件总览入口。

组合型组件的演示会体现真实关系：DropMenu 示例包含 DropMenuItem，IndexList 示例包含 IndexAnchor。单独页面仍用于说明各自 API。

## 兼容性与错误处理

- 保持 H5、微信小程序和 App 编译兼容。
- 子组件脱离正确父容器时不抛异常，维持当前安全降级行为。
- `beforeToggle` 支持异步 `resolve(boolean)`，类型明确表达回调协议。
- 样式接入现有 Snake UI CSS 变量并保留 fallback，未导入主题文件时外观不变。

## 验证

- 类型检查；
- 公共组件目录、根导出和 npm 发布清单测试；
- 文档、路由、演示配置一一对应测试；
- 原有 `snake-filter-sorts` 回归检查；
- H5、微信小程序和 App 三端构建；
- VitePress 含手机预览构建。

## 非目标

- 不重新设计 `snake-filter-sorts`；
- 不重命名现有 Props、事件或 `colseAll` 暴露方法；
- 不新增第三方依赖；
- 不将 `libs/internal` 的 InjectionKey 作为公共 API 导出。
