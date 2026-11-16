---
preview: /pages/componentsA/steps/index
---

# Steps 步骤条

按流程顺序展示进度，用于订单状态、售后处理、物流轨迹与多步表单；状态由父级 `current` 统一推导，单个步骤可用 `status` 覆盖。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`current` 为当前进行的索引（从 0 开始）：小于它的是已完成，等于它是进行中，大于它是未开始。已完成显示对勾，进行中保留序号：

```vue
<snake-steps :current="1">
    <snake-step title="提交订单" description="2026-11-11 10:20" />
    <snake-step title="商家发货" description="预计 24 小时内" />
    <snake-step title="确认收货" />
</snake-steps>
```

## 点状模式

`dot` 用实心小圆点替代序号，适合物流轨迹这类「只有节点、不强调第几步」的场景。已完成实心、进行中空心环、未开始灰色描边：

```vue
<snake-steps :current="2" dot>
    <snake-step title="已下单" description="10:20" />
    <snake-step title="已发货" description="10:45" />
    <snake-step title="运输中" description="14:08" />
    <snake-step title="已签收" />
</snake-steps>
```

## 纵向

订单详情页纵向排列，描述可放多行文本；最后一项不会留下多余空白：

```vue
<snake-steps :current="2" direction="vertical">
    <snake-step title="已下单" description="支付成功" />
    <snake-step title="已发货" description="顺丰 SF1234567890" />
    <snake-step title="运输中" description="快件已到达上海转运中心" />
    <snake-step title="待收货" />
</snake-steps>
```

## 对齐方式

横向时 `align-center` 默认开启，圆点与标题都以各自等分区域的中心对齐。电商订单流里想让文字左对齐时传 `:align-center="false"`，圆点会贴到区域左侧：

```vue
<snake-steps :current="1" :align-center="false">
    <snake-step title="待付款" description="30 分钟内未支付将取消订单" />
    <snake-step title="待发货" description="商家正在配货" />
    <snake-step title="待收货" />
</snake-steps>
```

## 自定义图标

`icon` 覆盖序号与对勾（优先级高于状态图形，也不受状态影响）；需要完全自定义时用 `#icon` 插槽：

```vue
<snake-steps :current="1">
    <snake-step title="待付款" icon="rmb" />
    <snake-step title="待发货" icon="bag" />
    <snake-step title="待收货" icon="car" />
</snake-steps>
```

## 异常状态

`status="error"` 让某一步显示为异常：圆点与标题转为错误色，图形替换为叉号，常用于「售后驳回」「支付失败」：

```vue
<snake-steps :current="1">
    <snake-step title="提交申请" />
    <snake-step title="审核未通过" status="error" description="商品已超过售后时限" />
    <snake-step title="退款到账" />
</snake-steps>
```

## API

### Props

| 参数            | 说明                                 | 类型                         | 默认值                                   |
| --------------- | ------------------------------------ | ---------------------------- | ---------------------------------------- |
| `customStyle`   | 根节点自定义样式                     | `StyleValue`                 | `''`                                     |
| `customClass`   | 根节点自定义类名                     | `string`                     | `''`                                     |
| `current`       | 当前进行到的索引，从 0 开始          | `number`                     | `0`                                      |
| `direction`     | 排列方向                             | `'horizontal' \| 'vertical'` | `'horizontal'`                           |
| `activeColor`   | 已完成与进行中的颜色                 | `string`                     | `var(--snake-color-primary, #06D290)`    |
| `inactiveColor` | 未开始的颜色                         | `string`                     | `var(--snake-color-text-muted, #909399)` |
| `errorColor`    | 异常状态的颜色                       | `string`                     | `var(--snake-color-error, #FA3534)`      |
| `alignCenter`   | 横向时圆点与文字是否居中，关闭后靠左 | `boolean`                    | `true`                                   |
| `dot`           | 用点状指示器替代序号圆点             | `boolean`                    | `false`                                  |

| 子项参数      | 说明                   | 类型                                         | 默认值 |
| ------------- | ---------------------- | -------------------------------------------- | ------ |
| `title`       | 步骤标题               | `string`                                     | `''`   |
| `description` | 步骤描述               | `string`                                     | `''`   |
| `icon`        | 自定义图标名，替代序号 | `string`                                     | `''`   |
| `status`      | 显式指定状态           | `'wait' \| 'process' \| 'finish' \| 'error'` | `''`   |

### Events

步骤条为纯展示组件，不派发事件；需要点击切换时由业务在 `snake-step` 外层包裹可点击容器。

### Slots

| 组件       | 插槽名  | 说明            |
| ---------- | ------- | --------------- |
| snake-step | default | 步骤描述内容    |
| snake-step | title   | 自定义标题      |
| snake-step | icon    | 自定义序号/图标 |

## 主题变量

| 变量名                          | 说明                           |
| ------------------------------- | ------------------------------ |
| `--snake-step-circle-size`      | 序号圆点直径                   |
| `--snake-step-dot-size`         | 点状模式圆点直径               |
| `--snake-step-index-size`       | 序号字号                       |
| `--snake-step-icon-size`        | 状态图标与自定义图标字号       |
| `--snake-step-title-size`       | 标题字号                       |
| `--snake-step-description-size` | 描述字号                       |
| `--snake-step-line-color`       | 连接线颜色                     |
| `--snake-step-status-color`     | 当前状态色（圆点/标题/连线源） |

## 注意

- 子步骤顺序由模板顺序决定，不依赖 `index` 手传；`v-for` 渲染时请给每个 `snake-step` 加 `:key`。
- 连接线由 `snake-step` 内部渲染的独立节点绘制（不是伪元素，也不依赖 `:last-child`），父级 `snake-steps` 只负责方向；因此不能把 `snake-step` 包在额外的 `view` 里，否则会导致最后一段连线判断错位。
- 横向各步骤等宽等分，标题与描述会按可用宽度换行；长单号、链接这类不折行的内容向整词换行，不会从中间截断。
- `status` 只影响当前步骤的图形与配色，不会改变相邻步骤的状态推导结果。
