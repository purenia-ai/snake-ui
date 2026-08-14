# 全局配置与底座

Snake UI 的通用底座包含主题、国际化、HTTP、路由与常用工具。API 统一使用 `snake` 命名，不需要安装 uView Pro，也不会向 `uni.$u` 写入内容。

## 安装配置

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from 'snake-ui';

export function createApp() {
    const app = createSSRApp(App);

    app.use(SnakeUI, {
        debugMode: import.meta.env.DEV ? 'warn' : false,
        theme: {
            defaultTheme: 'snake',
            defaultDarkMode: 'auto' // light | dark | auto
        },
        locale: {
            defaultLocale: 'zh-CN'
        },
        http: {
            config: {
                baseUrl: '/api',
                timeout: 20_000
            },
            interceptor: {
                request(config) {
                    return config;
                },
                response(data) {
                    return data;
                }
            }
        }
    });

    return { app };
}
```

全局能力可通过 `uni.$snake` 使用；在模块代码中也可以按需导入，便于类型推导和单元测试。

## 主题与暗色模式

默认主题使用 Snake 绿色，并提供 light、dark、auto 三种模式。H5 会监听 `prefers-color-scheme`，微信小程序和 App 在平台支持时监听 `uni.onThemeChange`。用户选择会写入本地存储。

```ts
import { setSnakeDarkMode, setSnakeTheme, setSnakeThemeColor, toggleSnakeDarkMode, useSnakeTheme } from 'snake-ui';

setSnakeDarkMode('auto');
toggleSnakeDarkMode();
setSnakeTheme('snake');
setSnakeThemeColor({ primary: '#00b77a' });

const { color, darkMode, isDark, setDarkMode } = useSnakeTheme();
```

注册自定义主题：

```ts
app.use(SnakeUI, {
    theme: {
        defaultTheme: 'brand',
        themes: [
            {
                name: 'brand',
                label: '品牌主题',
                color: { primary: '#00a86f' },
                darkColor: { primary: '#38d49b' }
            }
        ]
    }
});
```

组件使用 `--snake-color-*` 变量。业务样式可直接复用，例如：

```scss
.price {
    color: var(--snake-color-primary);
    background: var(--snake-color-surface);
    border-color: var(--snake-color-border);
}
```

## 国际化

内置 `zh-CN` 和 `en-US`。空状态、加载状态、图片错误及 HTTP 提示会跟随当前语言变化。

```ts
import { setSnakeLocale, snakeTranslate, useSnakeLocale } from 'snake-ui';

setSnakeLocale('en-US');
snakeTranslate('common.confirm'); // Confirm

const { locale, setLocale, t } = useSnakeLocale();
```

可以追加语言，也可以用同名语言覆盖部分词条；缺失词条按“当前语言 → 中文 → key”回退。

```ts
app.use(SnakeUI, {
    locale: {
        defaultLocale: 'en-US',
        locales: [
            {
                name: 'en-US',
                label: 'English',
                messages: { common: { confirm: 'OK' } }
            }
        ]
    }
});
```

## HTTP 请求

```ts
import { snakeHttp } from 'snake-ui';

const list = await snakeHttp.get('/goods', { page: 1 });
await snakeHttp.post(
    '/goods',
    { name: 'Snake' },
    {
        meta: { loading: true, toast: true }
    }
);
```

默认传输层使用 `uni.request`，2xx 返回响应的 `data`；非 2xx、网络失败、拦截器取消都会拒绝 Promise，并抛出 `SnakeHttpError`。`meta.originalData` 可保留完整响应。已有项目传入的旧 `request: { get, post }` 适配器仍然兼容。

## 常用能力

底座同时导出颜色转换、深拷贝与合并、防抖节流、查询参数、时间格式、事件总线、路由、Toast、Modal、节点测量等能力：

```ts
import { deepMerge, debounce, queryParams, useSnakeEmitter, useSnakeRouter, useSnakeToast } from 'snake-ui';
```

这些工具只依赖 Vue 和 uni-app 运行时，不会引入 uView 组件。

## 样式入口

应用入口已可直接导入完整样式：

```scss
@import 'snake-ui/index.scss';
```

如果只需要 SCSS 变量，可导入 `snake-ui/theme.scss`。第三方来源与 MIT 许可说明见包内 `THIRD_PARTY_NOTICES.md`。
