---
preview: /pages/componentsB/follow
cms: true
---

# 关注 <span class="cms-badge">CMS</span>
在微信小程序环境中展示官方账号关注组件。

## 运行前提

依赖微信小程序原生 `<official-account>` 组件，通过 `MP-WEIXIN` 条件编译启用。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 不支持 | 支持 | 不支持 |

H5 和 App 仅编译出空容器；官方账号关注能力必须在已关联公众号的微信小程序中真机验证。

## 基础用法

```vue
<snake-follow />
```

## 效果图

<div class="component-preview"><span class="component-preview__label">需在微信小程序真机环境查看</span></div>

## API

当前组件没有 Props、事件或插槽。

## 注意事项

- 非微信小程序平台只渲染空的 `<view>` 容器。
- 展示条件、账号关联和基础库要求由微信小程序平台控制。
- 当前文件没有组件 `name` 或脚本逻辑。

源码：`src/uni_modules/snake-ui/components/snake-follow/snake-follow.vue`
