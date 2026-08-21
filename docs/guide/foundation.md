# 全局配置与底座

Snake UI 插件统一初始化主题、国际化、HTTP、CMS 和全局工具。所有选项均为可选；只使用基础组件时，`app.use(SnakeUI)` 已经足够。

## 完整配置结构

```ts
import SnakeUI from 'snake-ui';

app.use(SnakeUI, {
    debugMode: import.meta.env.DEV ? 'warn' : false,
    theme: {
        defaultTheme: 'snake',
        defaultDarkMode: 'auto'
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
            request(options) {
                return options;
            },
            response(data) {
                return data;
            }
        }
    },
    cms: {
        services: {
            commerce,
            coupon,
            link
        }
    }
});
```

旧项目还可以传入 `request`、`cache` 和 `config` 适配器。它们用于既有业务组件和 CMS legacy 兼容路径，不是基础安装的必选项。

## 主题与暗色模式

默认提供 Snake 主题，暗色策略支持 `light`、`dark` 和 `auto`：

```ts
import { setSnakeDarkMode, setSnakeTheme, setSnakeThemeColor, toggleSnakeDarkMode, useSnakeTheme } from 'snake-ui';

setSnakeDarkMode('auto');
setSnakeThemeColor({ primary: '#00b77a' });
setSnakeTheme('snake');

const { color, darkMode, isDark, setDarkMode } = useSnakeTheme();
```

需要注册多套主题或全局注入 CSS 变量时，查看[多主题与暗黑模式](/guide/multi-theme)。

## 国际化

内置 `zh-CN` 和 `en-US`。缺失词条按“当前语言 → 中文 → key”回退。

```ts
import { setSnakeLocale, snakeTranslate, useSnakeLocale } from 'snake-ui';

setSnakeLocale('en-US');
snakeTranslate('common.confirm'); // Confirm

const { locale, setLocale, t } = useSnakeLocale();
```

追加或局部覆盖语言：

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

## HTTP

`snakeHttp` 默认使用 `uni.request`。2xx 响应返回 `data`；非 2xx、网络失败和拦截器取消都会拒绝 Promise。

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

设置 `meta.originalData: true` 可保留完整响应。也可以通过 `http.transport` 替换传输层。

## 全局工具与按需导入

插件会把 `$snake` 注入 Vue 全局属性，并在 uni-app 环境写入 `uni.$snake`：

```ts
uni.$snake.toast('操作完成');
uni.$snake.navTo('/pages/index/index');
await uni.$snake.sleep(300);
```

可复用模块更推荐按需导入：

```ts
import { debounce, deepMerge, navTo, queryParams, useSnakeEmitter, useSnakeRouter, useSnakeToast } from 'snake-ui';
```

这样类型推导、测试和依赖分析更直接。

路由、查询参数、时间和其他函数的完整说明见[工具](/guide/tools)。

## 样式入口

```scss
// 完整组件样式
@import 'snake-ui/index.scss';

// 只使用 SCSS 主题变量
@import 'snake-ui/theme.scss';
```

npm 与 `uni_modules` 的具体路径见[快速开始](/guide/getting-started)。第三方来源与许可证说明见包内 `THIRD_PARTY_NOTICES.md`。

## 下一步

- CMS 服务和数据流：[装修编辑器数据对接](/guide/sanke-editor)
- 品牌主题：[多主题与暗黑模式](/guide/multi-theme)
- 配置不生效：[常见问题](/guide/troubleshooting)
