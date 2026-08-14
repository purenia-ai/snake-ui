---
preview: /pages/componentsB/graphic-navigation
cms: true
---

# 图文导航 <span class="cms-badge">CMS</span>
使用图片与文字组成入口导航，并根据小程序审核状态过滤特定入口。

## 运行前提

依赖 `uni.$snake.navTo`、Snake UI 单位换算工具和 uni-app 本地存储。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-graphic-navigation
  :datas="{
    imgStyle: 0,
    navigationType: 0,
    backgroundColor: '#ffffff',
    imgMargin: 12,
    borderRadius: 16,
    textColor: '#24342c',
    textSize: 24,
    textHeight: 32,
    imageList: [
      { text: '新品', src: 'https://example.com/new.png', url: '/pages/new/index' },
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
| `datas` | 图文导航配置 | `Object` | 未声明 | - |

### 主要 `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `imgStyle` | `0` 为固定列表；`1` 对应的横向滚动模板当前已注释 |
| `imageList` | 导航项数组，每项读取 `src`、`text`、`url` |
| `navigationType` | 为 `0` 时渲染图片 |
| `backgroundColor` | 容器背景色 |
| `imgMargin`、`borderRadius` | 图片间距与圆角 |
| `textColor`、`textSize`、`textHeight` | 文字颜色、字号和行高 |
| `showSize`、`showSlider` | 滚动列表配置；当前可见模板未使用 |

组件未声明事件和插槽。

## 注意事项

- 固定模式中每项宽度按完整列表长度等分，项目较多时会明显变窄。
- `imgStyle === 1` 时外层容器存在，但实际滚动列表代码已被注释，不会显示导航项。
- 微信、支付宝小程序在审核隐藏状态下会过滤源码中指定的业务路径。

源码：`src/uni_modules/snake-ui/components/snake-graphic-navigation/snake-graphic-navigation.vue`
