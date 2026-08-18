---
preview: /pages/componentsB/hotzone
cms: true
---

# 热区图 <span class="cms-badge">CMS</span>
在一张背景图上按百分比布局多个可点击热区，热区范围与跳转链接由装修编辑器（sanke-editor）配置。

## 运行前提

依赖 uni-app 条件编译、`uni.$snake.navTo` 跳转与 CMS link-service 服务注入（外部链接场景）。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-hotzone
  :datas="{
    image: 'https://example.com/banner.png',
    hotzoneList: [
      {
        id: 'zone-1',
        top: 10,
        left: 8,
        width: 40,
        height: 30,
        httpType: 10,
        http: '/pages/activity/index',
      },
      {
        id: 'zone-2',
        top: 10,
        left: 52,
        width: 40,
        height: 30,
        httpType: 11,
        http: 'https://example.com/topic',
      },
    ],
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 装修数据（背景图与热区列表） | `Object \| null` | `{}` | - |
| `link-service` | CMS 跳转服务，用于打开外部链接 | `SnakeCmsLinkService` | - | - |
| `page-info` | 页面信息，透传给 link-service | `SnakeCmsPageInfo` | `{}` | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `image` | 背景图地址，`widthFix` 自适应高度 |
| `hotzoneList` | 热区数组 |
| `hotzoneList[].id` | 热区标识，列表渲染 key |
| `hotzoneList[].top` / `left` / `width` / `height` | 热区位置与尺寸，百分比 0-100，相对背景图 |
| `hotzoneList[].httpType` | 链接类型：`10` 内部链接、`11` 外部链接 |
| `hotzoneList[].http` | 跳转链接；为空时点击不跳转 |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `error` | 外部链接通过 link-service 打开失败时触发 | `SnakeCmsError` |

## 注意事项

- 内部链接（`httpType: 10`）走 `uni.$snake.navTo`，`navigateTo` 失败自动降级 `switchTab`，兼容 tabBar 页面。
- 外部链接（`httpType: 11`）必须通过注入的 link-service（`type: 'external'`）打开；legacy Joker 宿主的 link-service 会将其导航到 web-view 页面。未注入服务时组件报错提示，不执行跳转。
- 热区坐标为相对背景图的百分比，与装修编辑器存储格式一致，渲染随容器宽度等比缩放。

源码：`src/uni_modules/snake-ui/components/snake-hotzone/snake-hotzone.vue`
