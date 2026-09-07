# Snake UI

Snake UI 是面向 uni-app 商城与 CMS 场景的 Vue 3 组件库，支持 H5、微信小程序和 App。

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
import { setSnakeDarkMode, setSnakeLocale, snakeHttp } from '@puresnake/snake-ui';

setSnakeDarkMode('auto');
setSnakeLocale('en-US');
const data = await snakeHttp.get('/goods');
```

如需统一覆盖品牌色、文字色和圆角，可在应用入口导入可选主题变量：

```scss
@import '@puresnake/snake-ui/theme.scss';

:root,
page {
    --snake-color-primary: #06D290;
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

## 手动导入

组件推荐使用 easycom 标签；如需手动导入，按组件路径引入：

```ts
import SnakeButton from '@puresnake/snake-ui/components/snake-button/snake-button.vue';
import type { SnakeButtonProps, SnakePopupMode } from '@puresnake/snake-ui';
import { addUnit, navTo, sleep, toast } from '@puresnake/snake-ui/libs';
```

## 公开基础组件

`snake-icon`、`snake-popup`、`snake-overlay`、`snake-button`、`snake-image`、`snake-lazy-image`、`snake-tabs`、`snake-sticky`、`snake-notice-bar`、`snake-loadmore`、`snake-empty`、`snake-swiper`、`snake-button-sort`、`snake-drop-menu`、`snake-drop-menu-item`、`snake-index-list`、`snake-index-list-panel`、`snake-index-anchor`、`snake-form`、`snake-form-item`、`snake-input`、`snake-textarea`、`snake-checkbox`、`snake-checkbox-group`、`snake-radio`、`snake-radio-group`、`snake-switch`、`snake-slider`。

CMS 商品、优惠券和跳转能力通过 `app.use(SnakeUI, { cms: { services: ... } })` 注入。纯展示 CMS 不要求请求适配器；旧项目只配置 `request` 时会临时启用已弃用的 Joker 兼容适配器。
