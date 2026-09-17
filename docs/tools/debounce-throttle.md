---
preview: /pages/library/debounceThrottle/index
---

# 节流与防抖

节流限制一段时间内的执行频率；防抖等待连续操作停止后再执行。滚动和高频点击通常用节流，搜索输入和草稿保存通常用防抖。

## 防抖

```ts
import { debounce } from '@puresnake/snake-ui';

const search = debounce((keyword: string) => {
    console.log('搜索建议', keyword);
}, 500);

search('snake');
search.cancel();
```

`immediate: true` 会在首个调用立即执行，后续调用只刷新等待窗口。`debounce` 返回的包装函数没有返回业务回调结果；`cancel()` 取消尚未触发的定时调用。

## 节流

```ts
import { throttle } from '@puresnake/snake-ui';

const measure = throttle(() => {
    console.log('重新计算布局');
}, 200);
```

节流函数在窗口外立即执行；等待窗口内首次排队的调用会在窗口结束时执行，后续调用不会替换它的参数。返回函数同样提供 `cancel()`，取消后重置计时基准。

## 在 Vue 中清理

```ts
import { onBeforeUnmount } from 'vue';
import { debounce } from '@puresnake/snake-ui';

const save = debounce(() => console.log('保存草稿'), 600);
onBeforeUnmount(save.cancel);
```

组件卸载前取消定时器，避免离开页面后继续修改状态。

## 参数

| 函数                                  | 参数                           | 默认值                            |
| ------------------------------------- | ------------------------------ | --------------------------------- |
| `debounce(callback, wait, immediate)` | 回调、等待毫秒数、是否立即执行 | `wait = 300`，`immediate = false` |
| `throttle(callback, wait)`            | 回调、窗口毫秒数               | `wait = 300`                      |

需要在组合式代码中使用时，还可选择[useDebounce 与 useThrottle](/tools/use-rate-limit)；这两个封装同样需要手动清理。
