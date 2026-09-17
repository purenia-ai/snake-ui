---
name: 'query-params'
description: 'Snake UI 对象转 URL 参数参考。处理 query-params、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['query-params', '对象转', 'URL']
---

# 对象转 URL 参数

`getQueryParams(url)` 解析 URL 查询参数，`queryParams` 是兼容别名。

```ts
import { getQueryParams, queryParams } from '@puresnake/snake-ui';

getQueryParams('/pages/search?q=Snake+UI&page=2');
// { q: 'Snake UI', page: '2' }

queryParams('?empty=&tag=new'); // { empty: '', tag: 'new' }
```

## 返回值与边界

`getQueryParams(url: string): Record<string, string>` 取第一个 `?` 到 `#` 之间的内容。键和值会执行 URL 解码，加号按空格处理；重复键保留最后一个值，无查询串时返回空对象。

该工具按第一个 `=` 拆分参数值，值中再出现未编码的 `=` 会被截断；请先对参数编码。非法百分号编码会抛出 `URIError`。生成跳转参数时使用[路由跳转](/tools/route)。
