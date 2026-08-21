---
preview: /pages/tools/http
---

# HTTP 请求

`snakeHttp` 是面向 uni-app 的轻量请求客户端，支持 TypeScript、全局配置、请求/响应拦截器、Loading、Toast、自定义传输层和多实例。

## 基础使用

```ts
import { snakeHttp } from 'snake-ui';

interface Goods {
    id: number;
    name: string;
}

const goods = await snakeHttp.get<Goods[]>('/goods', { page: 1 });
await snakeHttp.post('/orders', { goodsId: goods[0].id });
```

`get(url, params, options)` 把第二个参数作为查询数据；`post/put/delete` 把第二个参数作为请求数据。

## 全局配置

```ts
import SnakeUI from 'snake-ui';

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
await snakeHttp.post('/login', form, {
    header: { 'x-device': deviceId },
    meta: { loading: false }
});
```

## 拦截器

```ts
import { configureSnakeHttp } from 'snake-ui';

configureSnakeHttp({
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

默认情况下，2xx 响应返回 `response.data`；`meta.originalData: true` 返回完整响应。非 2xx、传输失败、拦截器失败和取消都会拒绝 Promise。

```ts
import { SnakeHttpError, snakeHttp } from 'snake-ui';

try {
    await snakeHttp.get('/profile');
} catch (error) {
    if (error instanceof SnakeHttpError) {
        console.log(error.kind, error.statusCode, error.config);
    }
}
```

`kind` 为 `canceled`、`http`、`transport` 或 `interceptor`。

## 多实例与自定义传输

```ts
import { SnakeRequest } from 'snake-ui';

const analytics = new SnakeRequest();
analytics.setConfig({ baseUrl: 'https://events.example.com' });
analytics.setTransport(async options => ({
    statusCode: 200,
    data: { accepted: true, url: options.url },
    header: {}
}));
```

自定义 transport 适合测试、离线演示或接入宿主网络层，不需要替换全局 `snakeHttp`。

## 推荐的 API 分层

```ts
// api/goods.ts
import { snakeHttp } from 'snake-ui';

export const getGoods = (page: number) => snakeHttp.get<Goods[]>('/goods', { page });
```

页面只调用业务 API，不重复处理 base URL、Token 和通用错误。

## 平台说明

默认 transport 依赖 `uni.request`。上传、下载和流式响应不属于当前客户端职责，应使用对应 uni-app API 或宿主适配器。
