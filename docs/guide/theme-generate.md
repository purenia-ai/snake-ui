# 主题生成器

主题生成器用于可视化配置一套或多套 Snake UI 主题，并导出可直接注册的 `@puresnake/snake-ui.theme.ts`。

## 生成步骤

1. 选择或输入主题颜色，并确认颜色选择器。
2. 填写唯一的 `name`，按需补充 `label` 和 `description`。
3. 单主题可直接导出；多主题先逐套加入导出队列。
4. 下载 `@puresnake/snake-ui.theme.ts` 并放入宿主项目。

## 工具能力

- **分组色票**：按品牌与状态、文本与描边、背景与表面、通知与浮层分组，覆盖完整令牌。
- **智能生成暗色值**：开启暗黑色值后，基于亮色方案智能生成暗黑初始色值，可以逐项覆盖；支持一键刷新。
- **随机主题**：主题色组支持随机生成配色，作为起步方案再逐项调整。
- **导出队列**：配置好一套主题后加入队列，继续配置下一套，最后统一导出多套主题。
- **本地保存**：配置保存在浏览器本地，刷新页面不丢失。

## 配置工具

<ThemeGenerate />

## 注册导出结果

```ts
import SnakeUI from '@puresnake/snake-ui';
import snakeThemePresets from './snake-ui.theme';

app.use(SnakeUI, {
    theme: {
        themes: snakeThemePresets,
        defaultTheme: 'snake',
        defaultDarkMode: 'light'
    }
});
```

导出文件只保留相对默认色板发生变化的令牌，运行时会自动补齐其余颜色。

## 导出后检查

- 每套主题的 `name` 唯一，且 `defaultTheme` 能找到对应主题。
- 主按钮文字与实心主色有足够对比度。
- 浅色、暗色下的文字、边框、背景和禁用状态都可辨识。
- 在实际 H5、小程序或 App 页面检查，而不只依赖生成器预览。

::: warning 暗色生成
暗色值由启发式规则生成。复杂品牌色、无障碍要求或关键交易页面应由设计与前端共同复核。
:::

主题结构和运行时切换方式见[多主题与暗黑模式](/guide/multi-theme)。
