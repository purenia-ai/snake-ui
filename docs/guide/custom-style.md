# 自定义样式

Snake UI 支持从主题令牌、页面作用域样式和组件根节点三个层级定制外观。优先选择影响范围最小、能够跟随主题的方式，避免依赖组件内部 DOM 结构。

## 选择定制方式

| 需求 | 推荐方式 |
| --- | --- |
| 全应用品牌色、文字色、背景色 | 注册主题或覆盖主题色板 |
| 页面区域随主题和暗色模式变化 | 使用 `var(--snake-color-*)` |
| 单个组件调整间距或尺寸 | `custom-style` / `custom-class` |
| 所有页面获得主题变量 | Config Provider + 虚拟根组件 |
| 修改组件没有公开的内部结构 | 优先提出组件 API，而不是穿透内部样式 |

## 引入样式入口

npm 安装时在 `App.vue` 引入完整样式：

```scss
@import '@puresnake/snake-ui/index.scss';
```

只需要 SCSS 主题变量时使用：

```scss
@import '@puresnake/snake-ui/theme.scss';
```

`uni_modules` 安装应改用对应的本地相对路径。两种安装方式不要同时引入。

## 使用主题 CSS 变量

```scss
.order-card {
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    border: 1px solid var(--snake-color-border);
    box-shadow: 0 8rpx 24rpx var(--snake-color-shadow);
}

.order-card__action {
    color: var(--snake-color-primary-ink);
    background: var(--snake-color-primary);
}
```

常用令牌包括品牌与状态色、文字色、容器色以及边框、分隔、阴影和遮罩。完整色板结构及多主题注册方式见[多主题与暗黑模式](/guide/multi-theme)。

## 定制单个组件

支持样式扩展的组件通常提供 `custom-style` 和 `custom-class`。具体类型和作用节点以对应组件 API 为准。前者适合少量动态布局，后者适合较多静态规则。

不要通过深层选择器依赖组件内部类名；内部结构不是稳定的公共 API。

## 让主题覆盖页面

页面必须处于 `snake-config-provider` 的变量作用域内，主题和暗色模式才能完整传递。可以逐页包裹，也可以在 `App.root.vue` 中配合 `SnakeRoot` 插件统一注入。

完整根组件配置见 [ConfigProvider](/components/config-provider)。

## 暗色模式注意事项

- 业务样式优先使用语义变量，不要只覆盖亮色十六进制值。
- 主色实心背景上的文字使用 `--snake-color-primary-ink`。
- 图片、渐变和第三方内容不会自动适配暗色，需要单独处理。
- 在 `light`、`dark` 和 `auto` 三种策略下检查文字、边框、禁用态和遮罩。
- H5、小程序和 App 的样式隔离与节点结构不同，发布前在实际目标端验证。

需要生成完整明暗色板时使用[主题生成器](/guide/theme-generate)，样式没有生效时查看[常见问题](/guide/troubleshooting)。
