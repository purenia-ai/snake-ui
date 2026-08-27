# 节点布局信息

`getRect(selector, instance?)` 使用 uni-app selector query 获取首个节点的位置与尺寸。

```ts
import { getRect } from '@puresnake/snake-ui';

const rect = await getRect('.goods-card', instance);
console.log(rect.width, rect.top);
```

| 参数       | 说明                             |
| ---------- | -------------------------------- |
| `selector` | CSS 选择器                       |
| `instance` | 可选的组件实例，用于限定查询范围 |

查询不到节点时 Promise 会拒绝。应在挂载完成并等待 DOM 更新后调用；组合式写法见[useSnakeRect](/tools/use-rect)。
