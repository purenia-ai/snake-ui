# Snake UI

面向 uni-app 商城与 CMS 场景的 Vue 3 组件库，支持 H5、微信小程序和 App。基础组件和运行时工具均由本项目提供。

## 特性

- Vue 3 + uni-app，支持 H5、微信小程序、App
- 32 个公开基础、反馈、导航与表单组件
- 21 个商城 CMS 业务组件
- 支持 npm / `uni_modules` 使用方式
- 支持 easycom 自动注册
- Snake 主题、暗色模式、中英文、HTTP 与通用工具底座
- 请求、缓存、配置通过适配器注入，不绑定业务项目
- VitePress 文档提供真实 uni-app H5 手机预览

## 安装

```bash
pnpm add @puresnake/snake-ui
```

也可以将 `src/uni_modules/snake-ui` 复制到项目的 `src/uni_modules` 目录中使用。

## 注册运行时

在 `main.ts` 中安装插件。基础组件不需要适配器；CMS、优惠券、筛选和小程序跳转等业务组件按需配置适配器。

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from '@puresnake/snake-ui';

export function createApp() {
    const app = createSSRApp(App);

    app.use(SnakeUI, {
        theme: { defaultDarkMode: 'auto' },
        locale: { defaultLocale: 'zh-CN' },
        http: { config: { baseUrl: '/api' } },
        request: {
            get,
            post
        },
        cache: {
            get,
            set,
            delete: remove
        },
        config: {
            baseUrl: '/api'
        }
    });

    return { app };
}
```

主题、国际化和 HTTP 也支持直接调用：

```ts
import { setSnakeDarkMode, setSnakeLocale, snakeHttp } from '@puresnake/snake-ui';

setSnakeDarkMode('auto');
setSnakeLocale('en-US');
const data = await snakeHttp.get('/goods');
```

适配器接口：

```ts
interface SnakeRequestAdapter {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
}

interface SnakeCacheAdapter {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T, ttlSeconds?: number): void;
    delete(key: string): void;
}
```

缺少业务组件需要的适配器时，组件会抛出包含组件名和适配器名称的 `SnakeUIRuntimeError`。

## easycom 自动注册

在 `pages.json` 中增加：

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

页面中即可直接使用：

```vue
<template>
    <snake-button type="primary">确定</snake-button>
    <snake-tabs :list="['推荐', '新品']" :current="current" @change="current = $event" />
</template>
```

## 手动导入

```ts
import { SnakeButton, SnakePopup, SnakeGoodsList } from '@puresnake/snake-ui';

import { addUnit, navTo, sleep, toast } from '@puresnake/snake-ui/libs';
```

## 组件分类

### 基础组件

`snake-button`、`snake-empty`、`snake-icon`、`snake-image`、`snake-lazy-image`、`snake-loadmore`、`snake-notice-bar`、`snake-overlay`、`snake-popup`、`snake-sticky`、`snake-swiper`、`snake-tabs`。

### 表单组件

`snake-form`、`snake-form-item`、`snake-input`、`snake-textarea`、`snake-checkbox`、`snake-checkbox-group`、`snake-radio`、`snake-radio-group`、`snake-switch`、`snake-slider`。

### CMS 组件

`snake-cms`、`snake-custom-module`、`snake-images`、`snake-picture-ads`、`snake-magic-cube`、`snake-videos`、`snake-rich-text`、`snake-notice`、`snake-auxiliary-segmentation`、`snake-graphic-navigation`、`snake-commodity-search`、`snake-suspension`、`snake-page-popup`、`snake-jump-applet`、`snake-follow`、`snake-goods-list`、`snake-activity-list`、`snake-filter-sorts`、`snake-list-switching`、`snake-coupon`。

CMS 组件依赖业务数据结构或宿主项目适配器。请以对应文档中的 `datas`、`setStyle` 和 API 表为准。

## 使用运行时工具

```ts
import { snake } from '@puresnake/snake-ui/libs';

snake.toast('保存成功');
snake.navTo('/pages/example/components');
snake.sleep(300);
snake.addUnit(24);
```

也可以通过 `uni.$snake` 使用：

```ts
uni.$snake.toast('操作完成');
```

常用工具包括：`addUnit`、`pxToRpx`、`formatTime`、`getQueryParams`、`getRect`、`guid`、`navTo`、`sleep`、`toast` 和 `sys`。

## Snake CMS 示例

```vue
<snake-cms
    :page-info="{ pageId: 'home' }"
    :page-components="[
        {
            component: 'notice',
            setStyle: {
                direction: 'row',
                noticeText: '今日上新',
                textList: [],
                backColor: '#effaf5',
                textColor: '#176b4b',
                pageMargin: 24
            }
        }
    ]"
    :scroll-top="scrollTop"
/>
```

`page-components` 使用配置驱动渲染。纯展示配置不依赖请求；商品列表、筛选、活动场次、优惠券和跳转通过 `cms.services` 注入：

```ts
app.use(SnakeUI, {
    cms: {
        services: {
            commerce: {
                async getGoods({ component, params }) {
                    const data = await api.goods.list(component.setStyle.scene, params);
                    return { items: data.items, total: data.total };
                },
                navigateGoods({ item }) {
                    uni.navigateTo({ url: `/pages/goods/detail?id=${item.id}` });
                }
            }
        }
    }
});
```

旧项目在只配置 `request` 时仍会自动启用 Joker 兼容适配器；该行为已弃用，新项目应显式配置 `cms.services`，或用 `cms: { legacy: false }` 关闭兼容。

## 本地开发

```bash
# 启动 uni-app H5 示例
pnpm dev:h5

# 同时启动 H5 预览和 VitePress 文档
pnpm docs:dev:preview
```

默认端口：

- H5 预览：http://localhost:5173/snake-ui/h5/
- VitePress 文档：http://localhost:5174/

局域网访问时使用运行电脑的局域网 IP，例如 `http://192.168.1.10:5174/`。文档 iframe 会自动使用当前文档主机连接 H5 预览。

## 构建与检查

```bash
pnpm type-check
pnpm test:runtime
pnpm test:preview-structure
pnpm test:component-docs
pnpm test:uview-dependency
pnpm test:cms

pnpm build:h5
pnpm build:mp-weixin
pnpm build:app
pnpm docs:build
```

构建文档并内置 H5 预览：

```bash
pnpm docs:build:preview
```

## 文档

文档目录位于 `docs/`，每个组件页面都有独立的 API 说明和手机实时预览。CMS 组件在导航和标题处带有 `CMS` 标识。

## 平台说明

- 使用 uni-app 内置组件和 API，不能脱离 uni-app 当作普通 Vue Web 组件运行。
- `snake-follow` 依赖微信小程序的 `official-account` 能力。
- `snake-jump-applet` 依赖目标平台的小程序跳转 API 和业务配置。
- 使用 `fixed`、`sticky`、页面滚动或节点查询的组件，需要在目标平台真机验证布局。
- 组件库面向 Vue 3；Vue 2 不在支持范围内。

## 目录结构

```text
src/uni_modules/snake-ui/
├─ components/        # easycom 组件入口，固定为 snake-x/snake-x.vue
├─ libs/
│  ├─ function/       # 单职责工具模块，index.ts 只聚合导出
│  ├─ hooks/          # useSnakeX hooks
│  ├─ css/            # 主题与平台样式
│  ├─ config/         # 配置、主题状态与类型
│  ├─ request/        # HTTP 客户端
│  ├─ adapters/       # 宿主能力适配器
│  ├─ cms/            # CMS 运行时与服务协议
│  ├─ form/           # 表单校验能力
│  └─ internal/       # 仅组件库内部使用的关系协议
├─ locale/            # 国际化资源
├─ plugins/           # Vite 插件
├─ types/             # components/global/uni-app 声明入口
├─ index.ts           # 插件与公开运行时导出
├─ index.d.ts         # TypeScript 薄入口
├─ index.scss         # 全量样式入口
└─ theme.scss         # 可选主题变量
```

组件内部应从具体的 `libs/function`、`libs/config`、`libs/form` 等模块导入依赖，不应从 `../../libs` 聚合入口反向导入。对外稳定入口为包根、`@puresnake/snake-ui/libs`、`@puresnake/snake-ui/plugins`、`@puresnake/snake-ui/types`、`@puresnake/snake-ui/locale`、样式入口和 easycom 组件路径；`@puresnake/snake-ui/libs/*` 深层路径属于内部实现。

## License

项目许可证以仓库根目录的 LICENSE 文件为准。
