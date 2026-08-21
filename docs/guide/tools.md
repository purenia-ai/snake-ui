# 工具

Snake UI 提供常用纯函数、uni-app 平台封装和组合式函数。可复用模块优先按需导入；安装插件后，也可以通过 `uni.$snake` 或模板中的 `$snake` 调用兼容工具。

```ts
import { debounce, deepMerge, route, timeFormat, timeFrom } from 'snake-ui';

uni.$snake.toast('操作完成');
```

## 路由跳转

`route()` 兼容 uView Pro 的字符串简写和对象调用方式，并返回 `Promise<void>`。

```ts
import { route } from 'snake-ui';

await route('/pages/goods/detail', { id: 1, source: 'home' });

await route({
    type: 'redirectTo',
    url: '/pages/login'
});
```

支持的类型别名：

| `type` | uni-app API |
| --- | --- |
| `navigateTo`、`to` | `uni.navigateTo` |
| `redirect`、`redirectTo` | `uni.redirectTo` |
| `switchTab`、`tab` | `uni.switchTab` |
| `reLaunch` | `uni.reLaunch` |
| `navigateBack`、`back` | `uni.navigateBack` |

返回上一页不需要 URL：

```ts
await route({ type: 'back', delta: 2 });
```

导航失败会拒绝 Promise，建议在需要反馈的业务流程中捕获错误：

```ts
try {
    await route({ type: 'to', url: '/pages/order/detail', params: { id: orderId } });
} catch (error) {
    uni.$snake.toast(error instanceof Error ? error.message : '页面跳转失败');
}
```

### route 与 navTo

- 新代码和从 uView Pro 迁移的代码使用 `route()`：支持多种导航类型、参数对象和错误处理。
- 已有组件可以继续使用 `navTo()`：它保持同步调用，并在 `navigateTo` 失败时尝试 `switchTab`。
- `route()` 不做隐式降级，让调用方能够准确处理失败原因。

## 路由参数

`route()` 会对参数键和值进行 URL 编码。字符串、数字和布尔值会转换为字符串，`null` 与 `undefined` 会被忽略，数组使用重复键：

```ts
await route('/pages/search#result', {
    keyword: 'Snake UI',
    page: 2,
    tag: ['new', 'hot']
});
// /pages/search?keyword=Snake%20UI&page=2&tag=new&tag=hot#result
```

如果 URL 已有 query，新参数使用 `&` 追加。`switchTab` 不携带 `params`，因为不同 uni-app 平台对 tabBar 页面参数的支持不一致。

解析 URL 参数可以使用 `getQueryParams()` 或兼容别名 `queryParams`：

```ts
import { queryParams } from 'snake-ui';

queryParams('/pages/search?keyword=Snake+UI');
// { keyword: 'Snake UI' }
```

重复键会保留最后一个值，以维持现有 `Record<string, string>` 返回类型。

## 时间

`formatTime()` 与 `timeFormat()` 功能相同：

```ts
import { timeFormat, timeFrom } from 'snake-ui';

timeFormat(Date.now(), 'yyyy-mm-dd hh:MM:ss');
timeFrom(Date.now() - 5 * 60 * 1000); // 5分钟前
```

`timeFrom()` 支持 `Date`、日期字符串、秒级时间戳和毫秒级时间戳。无效时间返回空字符串；未来时间显示为“刚刚”；超过 30 天显示为 `yyyy-mm-dd`。

## 其他常用能力

```ts
import {
    colorToRgba,
    debounce,
    deepClone,
    deepMerge,
    getRect,
    guid,
    random,
    throttle,
    trim
} from 'snake-ui';
```

涉及组件实例、页面节点或导航的工具依赖对应 uni-app 平台 API。纯函数可以直接在普通 TypeScript 模块和测试中使用。
