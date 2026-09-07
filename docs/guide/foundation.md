# 全局配置总览

Snake UI 插件统一初始化主题、国际化、HTTP、CMS 和全局工具。所有选项均为可选；只使用基础组件时，`app.use(SnakeUI)` 已经足够。

## 完整配置结构

```ts
import SnakeUI from '@puresnake/snake-ui';

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
import { setSnakeDarkMode, setSnakeTheme, setSnakeThemeColor, toggleSnakeDarkMode, useTheme } from '@puresnake/snake-ui';

setSnakeDarkMode('auto');
setSnakeThemeColor({ primary: '#00b77a' });
setSnakeTheme('snake');

const { color, darkMode, isDark, setDarkMode } = useTheme();
```

需要注册多套主题或全局注入 CSS 变量时，查看[多主题与暗黑模式](/guide/multi-theme)。

## 国际化

内置 `zh-CN` 和 `en-US`。语言选择会持久化，缺失词条按“当前语言 → 中文 → key”回退。

```ts
import { setSnakeLocale, snakeTranslate, useLocale } from '@puresnake/snake-ui';

setSnakeLocale('en-US');
snakeTranslate('common.confirm'); // Confirm

const { locale, setLocale, t } = useLocale();
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

添加语言、运行时切换、插值和业务国际化协同方式见[国际化](/guide/internationalization)。

## HTTP

`snakeHttp` 默认使用 `uni.request`。2xx 响应返回 `data`；非 2xx、网络失败和拦截器取消都会拒绝 Promise。

```ts
import { snakeHttp } from '@puresnake/snake-ui';

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
uni.$snake.navTo('/pages/example/components');
await uni.$snake.sleep(300);
```

`$snake` 上还挂了对齐 uView 生态的配置面：`zIndex` 层级数值表（`uni.$snake.zIndex.popup === 10075`）、`type` 主题类型数组、`version` 库版本、`date`（`formatTime` 别名）与 `emitter` 事件总线单例；校验套件可通过 `uni.$snake.test.idCard(...)` 等 30 个校验器使用。

可复用模块更推荐按需导入：

```ts
import { debounce, deepMerge, mergeStyles, navTo, queryParams, useEmitter, useRouter, useToast } from '@puresnake/snake-ui';
```

从 uView Pro 移植组件时，uView 原名 hook 也可直接按需导入：

```ts
import { useParent, useChildren, useRect, getParent, $parent } from '@puresnake/snake-ui';
```

这样类型推导、测试和依赖分析更直接。

路由、查询参数、时间和其他函数的完整说明见[工具介绍](/tools/intro)。

## 样式入口

```scss
// 完整组件样式
@import '@puresnake/snake-ui/index.scss';

// 只使用 SCSS 主题变量
@import '@puresnake/snake-ui/theme.scss';
```

npm 与 `uni_modules` 的具体路径见[安装](/components/install)与[配置](/components/setting)。

## 下一步

- CMS 服务和数据流：[装修编辑器数据对接](/cms/sanke-editor)
- 语言包和运行时切换：[国际化](/guide/internationalization)
- 品牌主题：[多主题与暗黑模式](/guide/multi-theme)
- 配置不生效：[常见问题](/guide/troubleshooting)
