---
preview: /pages/componentsB/customModule/index
cms: true
---

# 自定义模块 <span class="cms-badge">CMS</span>

为 CMS 配置中的自定义内容提供一个通用插槽容器。

## 运行前提

仅依赖 Vue/uni-app 的组件和插槽能力。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-custom-module :datas="{ slotName: 'campaign' }">
  <view class="campaign-card">自定义活动内容</view>
</snake-custom-module>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">效果图由插槽内容决定</span></div>

## API

### Props

| 参数    | 说明                                   | 类型     | 默认值 | 可选值 |
| ------- | -------------------------------------- | -------- | ------ | ------ |
| `datas` | 自定义模块配置；当前渲染逻辑未读取字段 | `Object` | 未声明 | -      |

### Slots

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 模块渲染内容 |

组件未声明事件。

## 注意事项

源码保留了按 `datas.slotName` 使用具名插槽的注释，但当前实际渲染的是默认插槽。通过 `snake-cms` 使用时，父级仍会按配置声明具名 slot；接入前应核对宿主侧的插槽传递方式。

## 主题变量

组件未直接使用 CSS 主题变量，视觉样式完全由默认插槽内容决定。

源码：`src/uni_modules/snake-ui/components/snake-custom-module/snake-custom-module.vue`
