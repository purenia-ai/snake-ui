# 对象转 URL 参数

`queryParams(data)` 把对象拼接成 URL 查询串（与 uview 的 `$u.queryParams` 语义一致）；`getQueryParams(url)` 反向把查询串解析为对象。

```ts
import { getQueryParams, queryParams } from '@puresnake/snake-ui';

queryParams({ page: 2, tag: 'new' }); // '?page=2&tag=new'
queryParams({ ids: [1, 2] }, false, 'repeat'); // 'ids=1&ids=2'
getQueryParams('/pages/search?q=Snake+UI&page=2'); // { q: 'Snake UI', page: '2' }
```

## 拼接规则（queryParams）

`queryParams(data: Record<string, unknown>, isPrefix = true, arrayFormat = 'brackets'): string`

- 空值（`''` / `undefined` / `null`）参数直接跳过；
- 数组按 `arrayFormat` 序列化：`indices`（`ids[0]=1`）、`brackets`（`ids[]=1`，默认）、`repeat`（`ids=1`）、`comma`（`ids=1,2`），非法格式回退 `brackets`；
- 普通对象 JSON 序列化并 `encodeURIComponent`；
- 其余值经模板字符串原样输出、不做额外编码（与 uview 一致），含中文或特殊字符的值需自行编码后再传入。

## 解析规则（getQueryParams）

`getQueryParams(url: string): Record<string, string>` 取第一个 `?` 到 `#` 之间的内容。键和值会执行 URL 解码，加号按空格处理；重复键保留最后一个值，无查询串时返回空对象。

该工具按第一个 `=` 拆分参数值，值中再出现未编码的 `=` 会被截断；请先对参数编码。非法百分号编码会抛出 `URIError`。生成跳转参数时使用[路由跳转](/tools/route)。
