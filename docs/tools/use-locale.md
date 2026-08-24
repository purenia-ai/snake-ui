---
preview: /pages/tools/theme-locale
---

# 多语言

Snake UI 内置简体中文 `zh-CN` 和英文 `en-US`。语言状态是响应式的，切换结果会通过 `uni.setStorageSync` 保存，刷新或跳转页面后仍会沿用上次选择。

## 初始化语言

安装插件时可指定默认语言：

```ts
import SnakeUI from 'snake-ui';

app.use(SnakeUI, {
    locale: {
        defaultLocale: 'zh-CN'
    }
});
```

如果本地已经保存过用户选择，保存值优先于 `defaultLocale`。

## 在组件中切换

`useSnakeLocale(namespace?)` 提供当前语言、可选语言、翻译函数和切换方法：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useSnakeLocale } from 'snake-ui';

const { currentLocale, locales, t, setLocale } = useSnakeLocale();
const nextLocale = computed(() => (currentLocale.value.name === 'zh-CN' ? 'en-US' : 'zh-CN'));
</script>

<template>
    <view>{{ t('common.confirm') }}</view>
    <button @click="setLocale(nextLocale)">切换为 {{ nextLocale }}</button>
    <view v-for="locale in locales" :key="locale.name">{{ locale.label }}</view>
</template>
```

也可以在组件外直接切换：

```ts
import { setSnakeLocale } from 'snake-ui';

setSnakeLocale('en-US');
```

传入未注册的语言时，`setSnakeLocale()` 返回 `false`，并保持当前语言不变。

## 翻译和插值

直接使用 `snakeTranslate()`，或者通过 `useSnakeLocale()` 获取 `t()`：

```ts
import { snakeTranslate, useSnakeLocale } from 'snake-ui';

snakeTranslate('common.confirm'); // 当前为 en-US 时返回 Confirm

const { t } = useSnakeLocale('checkout');
t('welcome', { name: 'Snake' }); // 读取 checkout.welcome，并替换 {name}
```

`t()` 支持对象插值和数组插值。设置 namespace 后，调用时只需传入命名空间内部的 key。

## 自定义或覆盖语言包

通过插件配置追加语言，也可以局部覆盖内置语言。相同语言名称会与内置词条深度合并：

```ts
app.use(SnakeUI, {
    locale: {
        defaultLocale: 'en-US',
        locales: [
            {
                name: 'en-US',
                label: 'English',
                messages: {
                    checkout: {
                        submit: 'Place order',
                        welcome: 'Hello, {name}'
                    }
                }
            },
            {
                name: 'ja-JP',
                label: '日本語',
                messages: {
                    common: {
                        confirm: '確認'
                    }
                }
            }
        ]
    }
});
```

## 缺失词条回退

翻译按以下顺序查找：

1. 当前语言。
2. 内置或自定义覆盖后的简体中文 `zh-CN`。
3. 原始 key。

因此英文包缺少 `checkout.submit` 时会显示中文词条；中文也缺少时会直接显示 `checkout.submit`，不会渲染空文本。

语言和主题可以在右侧手机预览中直接切换。应用级接入、语言包组织和业务国际化协同方式见[国际化指南](/guide/internationalization)，完整插件配置参见[全局配置总览](/guide/foundation)。
