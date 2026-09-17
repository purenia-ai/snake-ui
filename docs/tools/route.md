---
preview: /pages/library/route/index
---

# 路由跳转

`route()` 提供强类型、Promise 化的 uni-app 页面导航；`navTo()` 保留旧项目的同步调用与 tabBar 降级行为。

## 基础使用

```ts
import { route } from '@puresnake/snake-ui';

await route('/pages/goods/detail', { id: 1, source: 'home' });

await route({
    type: 'redirectTo',
    url: '/pages/login'
});
```

## 导航类型

| type                     | uni-app API        | 是否需要 URL |
| ------------------------ | ------------------ | ------------ |
| `navigateTo`、`to`       | `uni.navigateTo`   | 是           |
| `redirect`、`redirectTo` | `uni.redirectTo`   | 是           |
| `switchTab`、`tab`       | `uni.switchTab`    | 是           |
| `reLaunch`               | `uni.reLaunch`     | 是           |
| `navigateBack`、`back`   | `uni.navigateBack` | 否           |

```ts
await route({ type: 'back', delta: 2 });
```

`delta` 默认为 1，输入会取整且最小为 1。`animationType` 和 `animationDuration` 仅在 `navigateTo`、`redirectTo` 时透传，具体动画效果由目标平台决定。

## 参数编码

字符串、数字和布尔值会写入 query；`null` 与 `undefined` 被忽略；数组使用重复键；已有 query 与 hash 会被保留。

```ts
await route('/pages/search#result', {
    keyword: 'Snake UI',
    page: 2,
    tag: ['new', 'hot']
});
// /pages/search?keyword=Snake%20UI&page=2&tag=new&tag=hot#result
```

`switchTab` 不携带 `params`，避免不同小程序平台产生不一致行为。

## route 与 navTo

- 新代码使用 `route()`，导航失败时 Promise 会拒绝。
- 已有组件可继续使用 `navTo()`；它在 `navigateTo` 失败后尝试 `switchTab`。
- `route()` 不处理任意 H5 外链或小程序跳转，这些策略应由业务 link service 统一负责。

## API 与失败处理

`route(url, params?)` 和 `route(options)` 都返回 `Promise<void>`。缺少 URL、导航类型不支持、平台 API 不可用或跳转失败时，Promise 会拒绝；调用方应在关键导航处处理失败。

`navTo(url?)` 返回 `void`，还识别 H5 HTTP 外链、`/miniprogram` 和 `/serviceChat` 等旧业务协议。其特殊协议由运行平台及宿主 API 决定，错误无法通过 Promise 捕获；新业务应明确采用自己的链接策略。
