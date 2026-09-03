# 国际化

Snake UI 内置简体中文 `zh-CN` 和英文 `en-US`，用于管理组件库自身的按钮、状态和提示文案。语言状态是响应式的，切换后组件文案会同步更新。

## 核心行为

- 通过 `setSnakeLocale()` 或 `useLocale()` 响应式切换。
- 用户选择自动保存在 `@puresnake/snake-ui-locale`。
- 同名语言包与内置词条深度合并。
- 缺失词条按“当前语言 → `zh-CN` → 原始 key”回退。
- 支持 `{name}` 和 `{0}` 形式的参数插值。

## 在应用入口配置

```ts
import SnakeUI from '@puresnake/snake-ui';

app.use(SnakeUI, {
    locale: {
        defaultLocale: 'zh-CN'
    }
});
```

本地已保存过有效语言时，保存值优先于 `defaultLocale`。设置 `force: true` 可以忽略保存值并强制使用本次配置。

## 运行时切换

```ts
import { setSnakeLocale } from '@puresnake/snake-ui';

const changed = setSnakeLocale('en-US');
```

语言已注册时返回 `true` 并持久化选择；名称不存在时返回 `false`，当前语言保持不变。

组件内使用 `useLocale()` 可以同时获得 `currentLocale`、`locales`、`setLocale` 和 `t`。完整交互示例见[多语言工具](/tools/use-locale)。

## 添加或覆盖语言包

```ts
app.use(SnakeUI, {
    locale: {
        locales: [
            {
                name: 'en-US',
                label: 'English',
                messages: {
                    common: { confirm: 'OK' }
                }
            },
            {
                name: 'ja-JP',
                label: '日本語',
                messages: {
                    common: {
                        confirm: '確認',
                        cancel: 'キャンセル'
                    }
                }
            }
        ]
    }
});
```

相同 `name` 的语言会覆盖元数据，并与已有 `messages` 深度合并。新增语言可以只提供当前项目需要的词条，其余 key 会尝试回退到中文；关键交易页面仍应检查所有可见文案。

## 翻译和参数插值

```ts
import { snakeTranslate, useLocale } from '@puresnake/snake-ui';

snakeTranslate('common.confirm');
snakeTranslate('checkout.welcome', { name: 'Snake' });
snakeTranslate('pagination.total', [20]);

const { t } = useLocale('checkout');
t('welcome', { name: 'Snake' }); // checkout.welcome
```

`useLocale(namespace)` 会自动为 `t()` 补上命名空间，适合按页面或业务模块组织词条。

## 与业务国际化协同

Snake UI 只管理组件库文案。业务页面可以继续使用 `vue-i18n` 等方案，在统一的语言切换入口同步业务语言、Snake UI 语言和系统语言。名称不一致时在这一层显式映射，不要让各页面分别维护规则。

```ts
function changeLocale(locale: 'zh-CN' | 'en-US') {
    i18n.global.locale.value = locale;
    setSnakeLocale(locale);
    uni.setLocale?.(locale === 'zh-CN' ? 'zh-Hans' : 'en');
}
```

## API 摘要

| API | 作用 |
| --- | --- |
| `setSnakeLocale(name)` | 切换并持久化已注册语言，返回是否成功 |
| `snakeTranslate(key, replacements?, localeName?)` | 翻译词条并执行参数替换 |
| `useLocale(namespace?)` | 获取当前语言、语言列表、`t()` 和切换方法 |
| `currentSnakeLocale` | 当前语言的响应式引用 |
| `snakeLocales` | 已注册语言列表的响应式引用 |

全局配置入口见[全局配置总览](/guide/foundation)。
