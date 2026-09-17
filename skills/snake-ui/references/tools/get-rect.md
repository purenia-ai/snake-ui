---
name: 'get-rect'
description: 'Snake UI 节点布局信息参考。处理 get-rect、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['get-rect', '节点布局信息']
---

# 节点布局信息

`getRect(selector, instance?)` 使用 uni-app selector query 获取首个节点的位置与尺寸。

```vue
<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue';
import { getRect } from '@puresnake/snake-ui';

const instance = getCurrentInstance();

onMounted(async () => {
    const rect = await getRect('.goods-card', instance);
    console.log(rect.width, rect.top);

    const cards = await getRect('.goods-card', instance, true);
    console.log(cards.length);
});
</script>

<template>
    <view class="goods-card">商品</view>
</template>
```

| 参数       | 说明                                                 |
| ---------- | ---------------------------------------------------- |
| `selector` | CSS 选择器                                           |
| `instance` | 可选的组件实例或查询上下文，用于限定查询范围         |
| `all`      | 默认 `false`，传 `true` 时查询全部匹配节点，返回数组 |

## 返回值与调用时机

`getRect(selector, instance?, all?)` 返回 Promise。单节点查询无结果时得到宽高及坐标均为 0 的兜底对象；`all: true` 无结果时得到空数组，不会因未匹配而拒绝。

应在节点渲染并完成 DOM 更新后调用。需要响应式结果和手动刷新时，使用[useRect](/tools/use-rect)。
