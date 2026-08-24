# 安装

Snake UI 支持 npm 包和 `uni_modules` 两种安装方式。请选择一种方式，避免项目同时存在两份组件库。

## 环境要求

开始前需要一个可正常运行的 uni-app Vue 3 项目：

| 依赖 | 要求 |
| --- | --- |
| Vue | `>= 3.4.0` |
| uni-app | `>= 3.0.0` |
| 样式处理 | 支持 SCSS 与 `rpx` |

普通 Vue Web 项目不等同于完整的 uni-app 运行环境。平台能力和业务依赖见[运行环境与能力边界](/guide/compatibility)。

## npm 安装

使用项目已有的包管理器安装：

::: code-group

```bash [pnpm]
pnpm add snake-ui
```

```bash [npm]
npm install snake-ui
```

```bash [yarn]
yarn add snake-ui
```

:::

npm 方式的插件、样式和组件路径都以 `snake-ui` 开头。

## uni_modules 安装

将组件库目录放入宿主项目的 `uni_modules/snake-ui`：

```text
你的项目/
└─ uni_modules/
   └─ snake-ui/
      ├─ components/
      ├─ index.ts
      ├─ index.scss
      └─ theme.scss
```

本地方式的导入路径应指向项目内的 `uni_modules/snake-ui`，不要再安装或引用 npm 副本。

## 下一步

安装完成后继续进行[工程配置](/components/setting)。如果是从 uView Pro 迁移，请先查看[迁移说明](/guide/migrate-from-uview)。
