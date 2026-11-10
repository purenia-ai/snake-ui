# 代码提示

Snake UI 面向 Vue 3 + TypeScript 开发，组件标签、属性、事件和工具函数都能获得 IDE 补全与类型校验。本文说明提示从哪来、需要什么编辑器配置，以及提示不生效时如何排查。

## 组件标签补全

组件通过 [easycom](/components/setting#_3-配置-easycom) 按 `snake-` 前缀解析，模板里直接书写标签即可，无需手动注册：

```vue
<snake-button type="primary" size="large">提交</snake-button>
<snake-tabs :list="tabs" :current="0" />
```

标签的类型提示来自组件库内置的全局组件声明 `global.d.ts`：它通过 `declare module 'vue'` 增强 `GlobalComponents`，把每个 `<snake-*>` 标签关联到真实的 `.vue` 组件。组件内部用 `defineProps<XxxProps>()` 声明的类型即为模板补全来源：属性名、类型、必填性和事件签名都能获得校验与补全。启用方式见[配置 · Volar 类型提示](/components/setting#_4-volar-类型提示)。

## 类型提示

### 包类型入口

`@puresnake/snake-ui` 不维护独立的声明入口，TypeScript 直接把包入口源码 `index.ts` 当作声明（源码即声明，同 wot UI、uView Pro 的源码分发方式）：

- 每个组件导出自己的 `XxxProps` 与 `XxxEmits` 类型。
- 全局 API 声明为 `uni.$snake` 与模板中的 `$snake`、`$themeStyle`，随入口源码自动生效。
- `import` 导入的类型走入口源码 `index.ts`，npm 与 uni_modules 安装均无需额外配置；模板标签提示走 `global.d.ts`，npm 安装需在 tsconfig 中启用（见上文）。

### 按需导入组件类型

把 props 和事件抽成对象时，直接导入对应类型：

```ts
import type { TabsEmits, TabsProps } from '@puresnake/snake-ui';

const tabsProps: TabsProps = {
    list: [{ name: '推荐' }],
    current: 0
};
```

### 工具函数与组合式函数

工具和 hooks 走 `@puresnake/snake-ui/libs` 子路径按需导入，类型自动推断，打包时也能 tree-shaking：

```ts
import { navTo, toast } from '@puresnake/snake-ui/libs';
import { useLocale, useTheme, useToast } from '@puresnake/snake-ui/libs';

const { setTheme } = useTheme();
```

不建议通过 `uni.$snake` 承接业务逻辑调用：全局属性适合模板与便捷访问，模块代码用按需导入获得最完整的类型推断。

## 编辑器建议

### VSCode + Volar

推荐使用 VSCode 与官方 Volar 插件开发 Vue 3 项目：

- 仅启用 Volar，禁用 Vetur，避免两套语言服务冲突。
- 推荐 `<script setup lang="ts">` 书写页面，获得最完整的类型推断与错误提示。

### HBuilderX

HBuilderX 内置 Vue 语言服务，可以正常编译和预览，但 TypeScript 提示能力比 Volar 弱，复杂类型（泛型组件、`import type`）可能不提示或不校验。需要最佳 TS 体验时，建议使用 CLI 项目 + VSCode；HBuilderX 项目也可以手动按组件路径导入类型。

## 类型不生效排查

按顺序检查：

1. **安装方式与路径一致**：npm 安装用 `@puresnake/snake-ui`，uni_modules 安装用 `@/uni_modules/snake-ui/...`，两种方式不要混用。
2. **Volar 未启用或 Vetur 未禁用**：检查扩展列表，重启 VSCode。
3. **组件目录名正确**：组件目录和文件名必须为 `snake-组件名`，easycom 才能解析到对应类型。
4. **重启 TS 服务**：修改 `pages.json` 的 easycom 或升级依赖后，重启语言服务（VSCode 命令面板执行 _TypeScript: Restart TS Server_）或重启编辑器。
5. **pnpm 项目模板标签无类型**：`tsconfig.json` 设置了 `baseUrl` 时会导致全局组件声明失效，移除后重启语言服务（`paths` 别名不受影响）。
6. **版本过旧**：升级 Snake UI 至最新版本后重试。

## 下一步

- 接入方式与 easycom 配置：[配置](/components/setting)
- 工具与 hooks 全景：[工具介绍](/tools/intro)
- 排错总入口：[常见问题](/guide/troubleshooting)
