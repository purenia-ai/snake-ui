---
preview: /pages/library/debounceThrottle/index
---

# 节流与防抖

节流限制一段时间内的执行频率；防抖等待连续操作停止后再执行。滚动和高频点击通常用节流，搜索输入和草稿保存通常用防抖。

## 防抖

```ts
import { debounce } from 'snake-ui';

const search = debounce((keyword: string) => {
    loadSuggestions(keyword);
}, 500);

search('snake');
search.cancel();
```

```ts
debounce(callback, (wait = 300), (immediate = false));
```

`immediate: true` 会在首个调用立即执行，后续调用只刷新等待窗口。

## 节流

```ts
import { throttle } from 'snake-ui';

const measure = throttle(() => {
    console.log('重新计算布局');
}, 200);
```

```ts
throttle(callback, (wait = 300));
```

节流函数会保留等待窗口内最后一次调用，并在窗口结束时执行。返回函数同样提供 `cancel()`。

## 在 Vue 中清理

```ts
import { onBeforeUnmount } from 'vue';
import { debounce } from 'snake-ui';

const save = debounce(persist, 600);
onBeforeUnmount(save.cancel);
```

组件卸载前取消定时器，避免离开页面后继续修改状态。
