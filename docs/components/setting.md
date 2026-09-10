# 配置

完成安装后，需要注册 Snake UI、引入全局样式，并让 uni-app 自动发现 `<snake-*>` 组件。

## 1. 注册组件库

::: code-group

```ts [npm]
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from '@puresnake/snake-ui';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI);
    return { app };
}
```

```ts [uni_modules]
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from './uni_modules/snake-ui';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI);
    return { app };
}
```

:::

主题、国际化、HTTP 和 CMS 服务都可以通过第二个参数配置，完整选项见[全局配置总览](/guide/foundation)。

## 2. 引入全局样式

在 `App.vue` 的全局样式中选择与安装方式匹配的路径：

::: code-group

```vue [npm]
<style lang="scss">
@import '@puresnake/snake-ui/index.scss';
</style>
```

```vue [uni_modules]
<style lang="scss">
@import './uni_modules/snake-ui/index.scss';
</style>
```

:::

`index.scss` 包含组件基础样式、主题变量和[内置样式类](/components/common)。只需要 SCSS 主题变量时，可单独引入 `theme.scss`。

## 3. 配置 easycom

在 `pages.json` 中配置一条规则：

::: code-group

```json [npm]
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "@puresnake/snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

```json [uni_modules]
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "@/uni_modules/snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

:::

项目中只能有一个 `easycom` 字段；已有配置时应合并 `custom` 规则。修改后请重新编译项目。

## 4. 使用组件

配置完成后无需在页面中注册：

```vue
<template>
    <snake-button type="primary">确定</snake-button>
</template>
```

如果不使用 easycom，也可以按组件路径手动导入：

```ts
import Button from '@puresnake/snake-ui/components/snake-button/snake-button.vue';
import Popup from '@puresnake/snake-ui/components/snake-popup/snake-popup.vue';
```

接下来用[快速上手](/components/quickstart)检查组件和全局工具是否都已生效。
