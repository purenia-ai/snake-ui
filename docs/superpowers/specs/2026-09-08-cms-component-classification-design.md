# CMS 组件分类设计

## 背景

Snake UI 同时包含通用 UI 组件、商城业务组件、CMS 页面装修区块，以及负责解析装修配置的 `snake-cms` 容器。当前组件源码采用 uni-app 友好的平铺目录，公开标签使用 `snake-*` 业务语义命名；文档已经初步使用 `cms` 标记分类，但运行时代码缺少一份明确、可复用的 CMS 内置区块目录。

本次调整需要让使用者和维护者能够判断组件的角色，同时避免批量重命名、破坏 easycom 自动导入或把可独立使用的业务组件错误限定为 CMS 专用组件。

## 目标

- 保持所有现有组件标签、组件目录和导入路径不变。
- 明确区分通用组件、商城业务组件、CMS 装修区块和 CMS 基础设施。
- 为 CMS 内置区块建立唯一的类型安全元数据目录。
- 让 CMS 类型、别名校验和文档分类可以逐步复用同一套概念。
- 保持 H5、微信小程序和 App 的现有静态渲染兼容性。

## 非目标

- 不把现有组件批量改名为 `snake-cms-*`。
- 不把 `components` 下的目录移动到 `base`、`business` 或 `cms` 子目录。
- 不在本次调整中将 `snake-cms.vue` 改造成 Vue 动态组件渲染器。
- 不修改服务注入、装修数据协议或现有组件的 props、emits 和样式。

## 命名与目录规则

公开组件名称继续表达组件能力，例如 `snake-magic-cube`、`snake-picture-ads` 和 `snake-goods-list`。只有 CMS 基础设施使用 `cms` 名称，例如现有的 `snake-cms`，以及未来可能增加的 provider、preview 或 editor adapter。

源码组件目录继续保持：

```text
components/
  snake-button/
  snake-goods-list/
  snake-magic-cube/
  snake-cms/
```

这样可以保持 uni-app easycom、当前包导出、类型声明和文档源码链接稳定。

## 分类模型

组件体系在文档和架构说明中使用四种角色：

1. **通用 UI 组件**：按钮、弹窗、表单、导航等，不依赖 CMS 数据协议。
2. **商城业务组件**：商品列表、优惠券、关注、活动列表等，可以直接在业务页面使用。
3. **CMS 装修区块**：能够由装修配置驱动并被 `snake-cms` 编排；其中部分也是可独立使用的商城业务组件。
4. **CMS 基础设施**：解析、标准化、诊断和编排装修配置的容器、类型及服务。

“商城业务组件”和“CMS 装修区块”允许重叠。是否属于 CMS 不通过组件名称推断，而通过显式元数据声明。

## CMS 区块目录

在 `libs/cms` 中增加无 Vue 组件引用的内置区块元数据目录。每项至少包含：

- `type`：CMS 数据协议中的稳定技术标识，与 `component` 字段一致。
- `category`：`content`、`navigation`、`commerce` 或 `custom`。
- `componentName`：对应的公开组件名称，用于诊断和文档展示。
- `standalone`：是否支持脱离 `snake-cms` 直接使用。

元数据对象使用 `as const satisfies` 保留字面量类型，并由其键推导 `SnakeCmsBuiltinComponent`，避免手写联合类型与运行时支持列表发生漂移。目录不直接导入 `.vue` 文件，避免改变包入口的运行时依赖和小程序构建行为。

别名仍然从兼容名称映射到正式 `type`；标准化逻辑通过目录判断内置类型，不再维护第二份硬编码集合。`snake-cms.vue` 继续使用静态模板分支，以满足小程序平台限制。

## 文档呈现

README 的单一“CMS 组件”列表拆分为：

- CMS 容器与基础设施
- CMS 内容与导航区块
- CMS 商城区块

文档明确说明 CMS 标记表示“可以被装修配置驱动”，不表示组件只能在 `snake-cms` 内使用。VitePress 现有 CMS 徽标和分组继续保留，分类名称与上述模型对齐；不改变现有文档 URL。

## 兼容性与迁移

本次变更应为向后兼容变更：

- Vue 标签不变。
- 手动导入路径不变。
- CMS `component` 技术标识不变。
- `SnakeCmsBuiltinComponent` 对外类型成员不变。
- 现有别名和 legacy adapter 行为不变。

因此使用者不需要迁移。未来新增 CMS 区块时，必须先加入区块目录，再增加静态渲染分支、类型与文档，避免支持面不一致。

## 验证

- TypeScript 类型检查通过，且现有 `SnakeCmsBuiltinComponent` 成员没有减少。
- CMS normalize/resolve 相关测试通过，并增加目录识别与别名解析测试。
- 文档构建通过，README 与 VitePress 分类一致。
- 检查生成包不因区块目录引入额外 `.vue` 运行时依赖。
- 搜索确认没有新增 `snake-cms-*` 业务组件名称，也没有修改现有公开路径。

## 实施范围

预计只修改以下区域：

- `src/uni_modules/snake-ui/libs/cms`：区块元数据、派生类型和识别逻辑。
- CMS 相关单元测试：元数据完整性、正式类型及别名行为。
- `README.md` 与现有 CMS/组件总览文档：角色说明和分类展示。

不涉及组件视觉效果、装修协议升级或业务接口调整。
