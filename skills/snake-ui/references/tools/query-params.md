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

queryParams('?empty=&tag=new');
```

键和值会执行 URL 解码，加号按空格处理。重复键保留最后一个值，以维持 `Record<string, string>` 返回类型。参数序列化由[路由跳转](/tools/route)统一完成。
