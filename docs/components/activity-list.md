---
preview: /pages/componentsB/activity-list
cms: true
---

# 活动列表 <span class="cms-badge">CMS</span>
横向展示拍卖活动入口、时间状态和当前选中项，并自动将当前项滚动到容器中部。

## 运行前提

依赖 uni-app `scroll-view`、节点查询 API，以及 `uni.$snake.sleep`、`formatTime`。样式包含组件自带的图标与字体类。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-activity-list
  :list="activities"
  :current="currentActivityId"
  @change="handleActivityChange"
/>
```

```js
const activities = [
  {
    id: '001',
    name: '正在热拍',
    subtitle: '限时竞价',
    squareImage: 'https://example.com/activity.png',
    startTime: Date.now() - 3600000,
    endTime: Date.now() + 3600000,
  },
]
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `list` | 活动列表 | `Array` | `[]` | - |
| `current` | `String \| Number` | `'001'` | 当前活动 ID |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `change` | 点击活动项后 | `(item, index)` |

### 活动项字段

| 字段 | 说明 |
| --- | --- |
| `id` | 与 `current` 匹配的活动标识 |
| `squareImage` | 方形封面；缺省时使用源码内远程默认图 |
| `name`、`subtitle` | 主标题和活动开始后的副标题 |
| `startTime`、`endTime` | 毫秒时间戳，用于状态和时间展示 |

## 注意事项

组件的 `currentTime` 是普通计算属性且没有响应式依赖，不会主动按时间流逝刷新。切换活动后当前高亮仍由父级 `current` 决定，父级应在 `change` 回调中同步更新。

源码：`src/uni_modules/snake-ui/components/snake-activity-list/snake-activity-list.vue`
