# libs 层对齐 uView Pro 审计

Snake UI 的 `libs/` 以 uView Pro 的 `libs/` 架构为参考基准组织。本页记录两者的逐模块对照与刻意分歧，供后续从 uView 移植组件或工具时查阅。

对照基准：uView Pro `src/uni_modules/uview-pro/libs`。

## 状态标记说明

| 标记 | 含义 |
| --- | --- |
| aligned | 结构与职责一致 |
| ported | 从 uView 移植而来（已去除 uView 运行时依赖） |
| snake-only | Snake UI 特有，uView 无对应物 |
| divergent | 刻意保持分歧（有备注说明原因） |
| gap | uView 有、Snake UI 暂缺（有备注说明取舍） |

## 入口与运行时

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `libs/index.ts`（聚合 `$u` + 命名导出 + hooks/configProvider 全量导出） | `libs/index.ts`（barrel）+ `foundation.ts`（聚合 `$snake`）+ `runtime.ts`（DI 注册表 + `uni.$snake` 挂载） | divergent | snake 拆成 foundation/runtime 两半再 `Object.assign`，为支撑宿主适配器注入；对外形态与 `$u` 一致（扁平函数 + `config` + `zIndex` + `http`） |
| `$u` 挂载 `uni.$u` | `$snake` 挂载 `uni.$snake` | aligned | |
| — | `$snakeThemeStyle` 全局属性 | snake-only | 返回当前主题的 `--snake-*` 变量表；内联绑定收敛到 `snake-config-provider`（组件不再各自内联） |

## config/

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `config/config.ts`（reactive AppConfig） | `config/state.ts`（`snakeConfig` + `SNAKE_UI_VERSION`） | aligned | 键名按 snake 语义 |
| `config/zIndex.ts`（数值表，8 个组件 types.ts 引用） | `config/zIndex.ts` | aligned | 键名与数值与 uView 对齐；`sticky` 保持 snake 现值 10（uView 为 970，CMS 传 19），属刻意分歧 |
| `config/color.ts` + `theme-tokens.ts`（SCSS/调色板） | `config/theme.ts`（运行时 CSS 变量 + 持久化 + 暗黑跟随） | divergent | snake 用 CSS 自定义属性换肤以支持小程序端与运行时切主题，不迁 uView 的 SCSS 方案 |

## function/

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `addUnit.ts`（默认 rpx） | `unit.ts`（`addUnit` 默认 px + `pxToRpx`） | divergent | snake 组件约定 px 默认；49 个调用点依赖此语义 |
| `test.ts`（30+ 校验器） | `function/test.ts` | ported | 全量校验套件；snake 原有 8 个语义保留（`number` 为 `Number.isFinite` 版） |
| `getRect.ts` | `function/getRect.ts`（自 platform.ts 拆出）+ `hooks/useRect.ts` | aligned | 函数版禁 `vue` import（node 直载测试约束），响应式版在 hooks |
| `guid.ts` / `toast.ts` / `sys.ts` / `trim.ts` / `random.ts` / `randomArray.ts` / `deepClone.ts` / `deepMerge.ts` / `debounce.ts` / `throttle.ts` / `clipboard.ts` / `type2icon.ts` / `timeFrom.ts` | 同名文件 | aligned | |
| `route.ts` | `function/route.ts`（`route` + `navTo`） | aligned | `navTo` 为 snake 扩展 |
| `queryParams.ts` | `function/queryParams.ts`（`getQueryParams` + 别名） | aligned | |
| `timeFormat.ts` | `function/timeFormat.ts`（`formatTime` + 别名） | aligned | |
| `getParent.ts` / `$parent.ts` | 同名文件 | ported | 供 uView 式组件移植使用 |
| `styleUtils.ts`（mergeStyles/mergeCssStrings） | `function/styleUtils.ts` | ported | 与既有 `style.ts`（kebabCase/addStyle/toStyle）并存，输出契约不同 |
| `sleep`（定义在 index.ts） | `function/sleep.ts` | aligned | |
| `colorGradient.ts` | `function/color.ts` 已覆盖 hexToRgb/rgbToHex/colorToRgba/colorGradient | aligned | 不单独建文件 |
| `md5.ts` / `parent.ts`（旧别名） | — | gap | 无使用场景，不移植 |
| `platform.ts` | —（反向） | snake-only | 兼容 barrel：钉死测试/joker/组件对旧路径的 import，长期保留 |

## hooks/

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `useCompRelation.ts`（useParent/useChildren/hasParent/broadcast） | `hooks/useCompRelation.ts` | ported | uView 原名导出，供移植组件直接引用 |
| `useRect.ts`（响应式） | `hooks/useRect.ts` | ported | |
| `useTheme` / `useColor` / `useLocale` | `useTheme` / `useColor` / `useLocale` | aligned | 原名对齐（原 useSnake* 前缀已去除） |
| `useDebounce` / `useThrottle` | `useDebounce` / `useThrottle` | aligned | |
| `useToast` / `useModal`（事件总线式，依赖 u-toast/u-modal 组件） | `useToast` / `useModal`（`uni.showToast/showModal` 薄包装） | divergent | snake 无 toast/modal 组件，不引入事件总线方案 |
| `useEmitter` | `useEmitter`（`function/emitter.ts` 单例） | aligned | |
| `useRouter`（不在 barrel） | `useRouter` | aligned | |

## internal/ 与组件关系模式

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| 关系逻辑全部走 useCompRelation（proxy 链 + Symbol 注册表） | `internal/`（类型化 InjectionKey + Context，表单族 ~20 组件在用）**并存** `useCompRelation` | divergent | 双轨：internal/ 服务 snake 原生表单族（类型更安全），useCompRelation 服务 uView 式移植；不互相迁移 |

## request/ · store/ · util/

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `request/`（Request 类 + http + 插件） | `request/index.ts`（SnakeRequest + snakeHttp + 可插拔 transport/legacy 适配器） | aligned | snake 增加宿主适配器回退 |
| `store/`（Pinia 嵌套路径 helpers） | — | gap | 库不绑定状态管理方案 |
| `util/`（vendored：config-provider/mitt/canvas-2d/省市区/async-validator/calendar/md5） | `config/theme.ts` 承担 configProvider 职责；`function/emitter.ts` 承担 mitt 职责 | divergent | snake 无 vendored 依赖；省市区/日历等按需再议（表单校验为自研 `form/`） |

## 业务模块（snake-only）

| 模块 | 职责 | 备注 |
| --- | --- | --- |
| `cms/` | 配置化页面渲染引擎（normalize/resolve/legacy-joker/use-commerce） | 类型单一事实来源在 `libs/cms/types.ts`；`components/snake-cms/types.ts` 为 re-export shim |
| `form/` | 表单校验引擎（path + validate） | 被 snake-form/snake-form-item 消费 |
| `adapters/`（已折叠进 `runtime.ts`） | 宿主能力注入门面（request/cache/config 工厂） | 折叠后仍从 `./libs` barrel 导出 |

## css/

| uView | Snake UI | 状态 | 备注 |
| --- | --- | --- | --- |
| `css/color.scss` / `common.scss` / `style.{components,h5,mp,nvue,theme,vue}.scss` | 同名对应（缺 `style.nvue.scss`，snake 不支持 nvue） | aligned | 类名前缀 `snake-`，色值走 `--snake-color-*` token |

## 宿主冻结面（joker 已核实）

以下路径被宿主直接引用，重构时必须保持可导入：

```text
uni_modules/snake-ui/libs/cms
uni_modules/snake-ui/libs/function/platform
uni_modules/snake-ui/libs/runtime
uni_modules/snake-ui/libs/foundation
uni_modules/snake-ui/components/**          （深路径组件导入）
uni_modules/snake-ui/components/snake-cms/types
$snakeThemeStyle 全局属性
```

`uni.$snake.*` 无外部调用者（全部在库内），但内部组件（含 Options API 与模板表达式）依赖其成员，**只增不删**。
