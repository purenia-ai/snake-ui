---
preview: /pages/library/http/index
---

# HTTP 请求

## uView 风格入口

`http` 是请求模块的规范单例。`snakeHttp` 仅作为兼容别名保留；请求模块默认导出 `httpPlugin`，可通过 `app.use(httpPlugin, { requestConfig, interceptor })` 挂载 `this.$http`；使用 `app.use(SnakeUI)` 时，`$http` 与 `$snake.http` 同时可用。

默认 `meta.originalData` 为 `true`，因此调用方会收到完整的 `uni.request` 响应。传入 `meta: { originalData: false }` 后才返回 `response.data`，且非 2xx 状态会 reject。请求拦截器取消仍会 reject `RequestError`，不会产生永久 pending 的 Promise。

`http` 是面向 uni-app 的轻量请求客户端，支持 TypeScript、全局配置、请求/响应拦截器、Loading、Toast、自定义传输层和多实例。

## 基础使用

```ts
import { http } from '@puresnake/snake-ui';

interface Goods {
    id: number;
    name: string;
}

const goods = await http.get<Goods[]>('/goods', { page: 1 }, { meta: { originalData: false } });
await http.post('/orders', { goodsId: goods[0].id });
```

`get(url, params, options)` 把第二个参数作为查询数据；`post/put/delete` 把第二个参数作为请求数据。示例显式设置 `originalData: false`，以获得接口数据；默认返回完整 uni-app 响应，不能直接当作商品数组使用。

## 全局配置

```ts
import SnakeUI from '@puresnake/snake-ui';

app.use(SnakeUI, {
    http: {
        config: {
            baseUrl: 'https://api.example.com',
            timeout: 20_000,
            header: { 'content-type': 'application/json' },
            meta: { loading: true, toast: true, originalData: false }
        }
    }
});
```

单次请求配置会覆盖全局值，`header` 与 `meta` 做深合并：

```ts
await http.post('/login', form, {
    header: { 'x-device': deviceId },
    meta: { loading: false }
});
```

## 拦截器

```ts
import { configureHttp } from '@puresnake/snake-ui';

configureHttp({
    interceptor: {
        request(options) {
            return {
                ...options,
                header: { ...options.header, Authorization: `Bearer ${token}` }
            };
        },
        response(data) {
            return data;
        }
    }
});
```

请求拦截器返回 `false` 表示取消。响应拦截器可以转换最终返回值，抛出的异常会包装为可识别的 HTTP 错误。

## 响应与错误

默认 `meta.originalData: true` 时返回完整响应；设置为 `false` 后，任意 HTTP 2xx 返回 `response.data`，其他状态会 reject。传输失败、拦截器失败和取消都会 reject Promise。并发开启 `meta.loading` 时，Loading 会在最后一个请求结束后才关闭。

```ts
import { http, RequestError } from '@puresnake/snake-ui';

try {
    await http.get('/profile');
} catch (error) {
    if (error instanceof RequestError) {
        console.log(error.kind, error.statusCode, error.config, error.platformError);
    }
}
```

`kind` 为 `canceled`、`http`、`transport` 或 `interceptor`。`transport` 错误会保留宿主的原始失败对象到 `platformError`；支付宝小程序的 `errMsg`、网络/证书/域名错误可据此直接排查。Snake 内部的 `baseUrl`、`meta` 与 `params` 不会透传给 `uni.request`。

## 多实例与自定义传输

```ts
import { Request } from '@puresnake/snake-ui';

const analytics = new Request();
analytics.setConfig({ baseUrl: 'https://events.example.com' });
analytics.setTransport(async options => ({
    statusCode: 200,
    data: { accepted: true, url: options.url },
    header: {}
}));
```

自定义 transport 适合测试、离线演示或接入宿主网络层，不需要替换全局 `http`。

## 推荐的 API 分层

```ts
// api/goods.ts
import { http } from '@puresnake/snake-ui';

interface Goods {
    id: number;
    name: string;
}

export const getGoods = (page: number) => http.get<Goods[]>('/goods', { page }, { meta: { originalData: false } });
```

页面只调用业务 API，不重复处理 base URL、Token 和通用错误。

## 接口配置表

```ts
import { AutoHttp, http } from '@puresnake/snake-ui';

const api = new AutoHttp.Builder(http).dispatch({
    goods: { url: '/goods', method: 'GET' },
    detail: { url: '/goods', method: 'GET' }
});

await api.goods({ data: { page: 1 } });
await api.detail({ url: () => '/42' });
```

`AutoHttp.Builder` 根据接口配置表生成请求函数，也支持传入自定义的 Promise 请求函数。

## 平台说明

默认 transport 依赖 `uni.request`。上传、下载和流式响应不属于当前客户端职责，应使用对应 uni-app API 或宿主适配器。

## API 速查

| 入口                   | 用途                                            |
| ---------------------- | ----------------------------------------------- |
| `http`                 | 全局请求单例，提供 `get/post/put/delete` 等方法 |
| `configureHttp(setup)` | 配置全局请求与拦截器                            |
| `new Request()`        | 创建独立配置、拦截器和传输层的客户端            |
| `RequestError`         | 捕获取消、HTTP、传输或拦截器错误                |

请在项目中统一选择“完整响应”或“数据体”返回约定，并在业务 API 层固定配置，避免同一类型参数对应不同返回形状。
