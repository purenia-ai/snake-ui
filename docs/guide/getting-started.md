# 快速开始

Snake UI 是一组面向移动商城和可视化装修场景的 uni-app Vue 3 组件，可通过 npm 或 `uni_modules` 使用。

## 运行前提

- 可编译 Vue 单文件组件的 uni-app 工程
- 工程支持 `rpx` 和 uni-app 内置组件
- 使用业务组件时，通过 Snake UI 插件传入请求、缓存和配置适配器

::: warning 版本说明
源码同时包含 Options API、普通 `setup()` 和 `<script setup>`。请以宿主项目当前使用的 Vue/uni-app 编译链为准，不要仅为文档统一写法。
:::

## npm 安装

```bash
pnpm add snake-ui
```

```ts
import SnakeUI from 'snake-ui';

app.use(SnakeUI, {
    theme: { defaultDarkMode: 'auto' },
    locale: { defaultLocale: 'zh-CN' },
    http: { config: { baseUrl: '/api' } },
    request: { get, post },
    cache: { get, set, delete: remove },
    config: { baseUrl: '/api' }
});
```

如需全局基础样式，在 `App.vue` 引入 Snake UI 样式：

```scss
@import 'snake-ui/index.scss';
```

## 配置 easycom

在 `pages.json` 中配置 npm 组件发现规则：

```json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            "^snake-(.*)": "snake-ui/components/snake-$1/snake-$1.vue"
        }
    }
}
```

## 使用 Snake 全局工具

安装插件后，Options API 和模板中可使用 `$snake`，普通脚本可使用 `uni.$snake`：

```ts
uni.$snake.toast('操作完成');
uni.$snake.navTo('/pages/index/index');
await uni.$snake.sleep(300);
```

可复用模块更推荐按需导入，类型推导和测试会更直接：

```ts
import { navTo, sleep, toast } from 'snake-ui';
```

页面中无需手动注册组件：

```vue
<template>
    <snake-notice :datas="noticeConfig" />
</template>

<script>
export default {
    data() {
        return {
            noticeConfig: {
                direction: 'row',
                noticeText: '欢迎来到商城',
                textList: [],
                isLeftIcon: true,
                backColor: '#effaf5',
                textColor: '#176b4b',
                pageMargin: 24,
                height: 72,
                url: '/pages/index/index'
            }
        };
    }
};
</script>
```

## 使用 CMS 容器

`<snake-cms>` 根据 `pageComponents` 中的 `component` 字段选择并渲染模块：

```vue
<snake-cms :page-info="pageInfo" :page-components="pageComponents" :scroll-top="scrollTop" :sticky-offset-top="0" />
```

完整的配置映射和商品数据流见 [Snake CMS](/components/snake-cms)。

## 文档约定

- 每个组件页右侧都运行真实 uni-app H5 示例；窄屏可点击“在新窗口打开实时预览”。
- `datas` 字段表记录源码实际读取的键，不代表后端接口的完整响应协议。
- 源码未明确类型或默认值时，API 表格会标记为“未声明”。
- 预览使用本地 mock 适配器，不会调用业务生产接口。
