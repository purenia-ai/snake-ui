# Snake UI

Snake UI 是面向 uni-app 商城与 CMS 场景的 Vue 3 组件库，支持 H5、微信小程序、支付宝小程序和 App。

- 官方文档：[https://m.puresnake.com/snake-ui/](https://m.puresnake.com/snake-ui/)
- 在线演示：[https://m.puresnake.com/snake-ui/h5/](https://m.puresnake.com/snake-ui/h5/)
- 更新日志：[changelog.md](https://github.com/purenia-ai/snake-ui/blob/main/src/uni_modules/snake-ui/changelog.md)

## 安装

```bash
pnpm add @puresnake/snake-ui
```

在 `main.ts` 安装组件库，并按业务需要传入适配器：

```ts
import SnakeUI from '@puresnake/snake-ui';

app.use(SnakeUI, {
    theme: { defaultDarkMode: 'auto' },
    locale: { defaultLocale: 'zh-CN' },
    http: { config: { baseUrl: '/api' } },
    request: { get, post },
    cache: { get, set, delete: remove },
    config: { baseUrl: '/api' }
});
```

Snake UI 不依赖其他 UI 组件库，不需要额外导入第三方主题样式。底座内置 Snake 绿色明暗主题、`zh-CN` / `en-US`、基于 `uni.request` 的 HTTP 客户端和常用 hooks / 工具。

```ts
import { http, setDarkMode, setLocale } from '@puresnake/snake-ui';

setDarkMode('auto');
setLocale('en-US');
const data = await http.get('/goods');
```

如需统一覆盖品牌色、文字色和圆角，可在应用入口导入可选主题变量：

```scss
@import '@puresnake/snake-ui/theme.scss';

:root,
page {
    --snake-color-primary: #06d290;
}
```

## easycom

```json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "@puresnake/snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

```vue
<snake-button type="primary">确定</snake-button>
<snake-popup v-model="visible" mode="bottom">...</snake-popup>
```

## Volar 支持

组件库内置全局组件类型声明（`global.d.ts`），在 Volar（VS Code）和 `vue-tsc` 中为模板里的 `<snake-*>` 标签提供 props、事件的类型提示与检查，无需手动导入组件类型。

- **uni_modules 安装**：零配置。`src/uni_modules/snake-ui/global.d.ts` 位于项目 tsconfig 的 `include` 范围内，类型声明自动生效。
- **npm 安装**：在 `tsconfig.json` 的 `compilerOptions.types` 中添加 `"@puresnake/snake-ui/global"`（已有 `types` 数组时追加即可）：

```json
// tsconfig.json
{
    "compilerOptions": {
        "types": ["@dcloudio/types", "@puresnake/snake-ui/global"]
    }
}
```

提示：HBuilderX 项目不支持此配置，本节仅适用于 CLI 项目。若添加后组件类型仍未生效且项目使用 pnpm，请移除 `tsconfig.json` 中的 `baseUrl` 后重试（`paths` 别名不受影响）。

## 手动导入

组件推荐使用 easycom 标签；如需手动导入，按组件路径引入：

```ts
import Button from '@puresnake/snake-ui/components/snake-button/snake-button.vue';
import type { ButtonProps, PopupMode } from '@puresnake/snake-ui';
import { addUnit, navTo, sleep, toast } from '@puresnake/snake-ui/libs';
```

## 公开基础组件

`snake-icon`、`snake-popup`、`snake-overlay`、`snake-button`、`snake-image`、`snake-tabs`、`snake-sticky`、`snake-notice-bar`、`snake-loadmore`、`snake-empty`、`snake-swiper`、`snake-button-sort`、`snake-drop-menu`、`snake-drop-menu-item`、`snake-index-list`、`snake-index-list-panel`、`snake-index-anchor`、`snake-form`、`snake-form-item`、`snake-input`、`snake-textarea`、`snake-checkbox`、`snake-checkbox-group`、`snake-radio`、`snake-radio-group`、`snake-switch`、`snake-slider`。

CMS 商品、优惠券和跳转能力通过 `app.use(SnakeUI, { cms: { services: ... } })` 显式注入。纯展示 CMS 不要求请求适配器。
