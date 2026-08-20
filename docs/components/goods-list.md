---
preview: /pages/componentsB/goods-list
cms: true
---

# 商品列表 <span class="cms-badge">CMS</span>

以自适应卡片网格展示直购、新品或拍卖商品，包含库存、价格、标签和出价状态。

## 运行前提

依赖 Snake UI LazyImage、uni-app 基础组件和运行时图片处理逻辑。部分状态图使用源码内置 CDN 地址。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-goods-list
    :goods-list="goods"
    list-type="sale"
    :commodity-type="0"
    :page-margin="10"
    :image-margin="10"
    @item-click="openDetail"
    @handlerOffer="openOffer"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数             | 说明                                            | 类型      | 默认值      | 可选值 |
| ---------------- | ----------------------------------------------- | --------- | ----------- | ------ |
| `goodsList`      | 商品数据                                        | `Array`   | `[]`        | -      |
| `bgColor`        | 列表背景色                                      | `String`  | `'#F6F6F6'` | -      |
| `listType`       | 展示类型；模板重点处理 `sale`、`new`、`auction` | `String`  | `'goods'`   | -      |
| `pageMargin`     | 页面边距                                        | `Number`  | `10`        | -      |
| `imageMargin`    | 卡片间距                                        | `Number`  | `10`        | -      |
| `commodityType`  | 参与计算每行卡片数量和宽度                      | `Number`  | `0`         | -      |
| `attendanceShow` | 是否显示拍卖参与人数                            | `Boolean` | `true`      | -      |

### Events

| 事件名         | 触发时机                               | 回调参数        |
| -------------- | -------------------------------------- | --------------- |
| `item-click`   | 点击整个商品卡片                       | `(item, index)` |
| `handlerOffer` | 点击拍卖出价按钮；事件名保持源码大小写 | `(item, index)` |

### 主要商品字段

商品卡片会读取 `id`、`image`、`name`、`goodsName`、`price`、`discountPrice`、`jokerPrice`、`salePrice`、`size`、`gradeName`、`grade`、`amount`、`channelStatus`、`status`、`newestTime`、`saleType`、`type`、`tag` 以及多个促销字段。拍卖模式还会读取 `activityInfo` 中的 `status`、`startTime`、`endTime`、`attendance`、`myPrice`、`myRank`、`activityType` 和活动标签。

## 注意事项

- `commodityType + 2` 用作列数基数，传入负数或异常值会产生无效宽度。
- 图片处理会把 `http:` 替换为 `https:`，并为指定 CDN 域名追加 OSS 样式参数。
- 组件直接读取 `item.image` 并调用字符串方法，商品数据应保证图片字段存在。
- 远程默认图和标签图的可用性会影响视觉结果，但不影响文档构建。

源码：`src/uni_modules/snake-ui/components/snake-goods-list/snake-goods-list.vue`
