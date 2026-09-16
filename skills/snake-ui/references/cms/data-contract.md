---
name: 'data-contract'
description: 'Snake UI CMS 页面数据协议参考。处理 data-contract、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['data-contract', 'CMS', '页面数据协议']
---

# CMS 页面数据协议

## 页面信封

新页面推荐使用 v2 信封（以下为协议示意类型，公开的容器入参类型为 `CmsComponentConfig`）：

```ts
interface CmsV2Block {
    id?: string | number;
    component: `v2.${string}`;
    text?: string;
    type?: string;
    active?: boolean;
    props: Record<string, unknown>;
}
```

```ts
const pageComponents = [
    {
        id: 'notice-1',
        component: 'v2.notice',
        text: '公告',
        type: '3-6',
        active: true,
        props: {
            direction: 'row',
            noticeText: '今日上新',
            link: { httpType: 10, http: '/pages/new/index' },
            textList: [],
            isLeftIcon: true,
            style: { height: 72, pageMargin: 10, backgroundColor: '#eaf1ff', textColor: '#2d57e7' }
        }
    }
];
```

`component` 和 `props` 是运行时契约。`text`、`type` 用于编辑器展示和分类，运行时不会用它们选择渲染器。`active` 省略时按启用处理。

## 链接

```ts
interface CmsV2Link {
    httpType: 10 | 11;
    http: string;
}
```

- `10`：宿主内部导航。
- `11`：外部链接。
- 空 `http` 不执行跳转。

所有跳转最终由 [link service](/cms/services#链接服务) 执行，区块不直接绑定业务路由。

## 图片项与文本项

```ts
interface CmsV2ImageItem {
    id?: string | number;
    src: string;
    link: CmsV2Link;
}

interface CmsV2TextItem {
    text: string;
    link: CmsV2Link;
}
```

## 共享图片样式

`images`、`carousel` 和 `video` 使用同一组视觉字段：

| 字段                    | 类型                | 默认值      | 说明             |
| ----------------------- | ------------------- | ----------- | ---------------- |
| `style.heightMode`      | `'auto' \| 'fixed'` | `'auto'`    | 自适应或固定高度 |
| `style.height`          | `number`            | `200`       | 固定高度，rpx    |
| `style.pageMargin`      | `number`            | `0`         | 左右页边距，rpx  |
| `style.imageRadius`     | `number`            | `0`         | 圆角，rpx        |
| `style.backgroundColor` | `string`            | `'#FFFFFF'` | 背景颜色         |

编辑器画布的半尺寸预览值不会落库，消费端不要再次除以二。

## 版本共存

`snake-cms` 可以在同一页面中渲染 v1 和 v2 区块。v1 使用未带 `v2.` 前缀的 `component` 和 `setStyle`，例如 `{ component: 'images', setStyle: { imageList: [] } }`；v2 使用 `{ component: 'v2.images', active: true, props: { ... } }`。v1 可通过 `visible: false` 或 `setStyle.showComponent: false` 隐藏，v2 使用 `active: false`。

宿主应在数据进入 `snake-cms` 前校验数组和对象；新配置使用 v2，已有 v1 页面无需一次性迁移。
