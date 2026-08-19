# 主题生成器

Snake UI 提供多主题与暗黑模式配置工具，交互方式与 uView Pro 的多主题配置工具一致：在打开的颜色拾取器中输入或选择颜色，再点「确定」按钮即可；配置完成后在底部填写主题元信息，可加入导出队列导出多套主题。

基于以下配置工具可以配置多套主题！

## 配置教程

- 在打开的颜色拾取器中输入或者选择颜色，再点「确定」按钮即可；
- 颜色配置完后，在页面底部填写主题元信息（name/label/description）后，点击导出；
- 如果是导出多主题，可以配置好一套主题后添加到导出队列，再次配置其他主题，最终都添加到导出队列中，再点击导出；
- 最终导出会得到一个名为 `snake-ui.theme.ts` 的文件。

## 配置工具

提示：该工具支持单主题、多主题配置，支持智能生成颜色值、暗黑色值，随机主题颜色等。配置完成后点击导出，即可得到主题配置文件。

<ThemeGenerate />

## 导出文件

导出的文件与 demo 工程 `src/snake-ui.theme.ts` 结构一致，可直接覆盖使用：

```ts
import { defaultSnakeTheme, type SnakeTheme } from './uni_modules/snake-ui';

export const snakeThemePresets: SnakeTheme[] = [
    defaultSnakeTheme,
    {
        name: 'purple',
        label: '雾紫主题',
        description: '电商 / 活动 / 品牌',
        color: {
            primary: '#7C3AED',
            primaryDark: '#6D33D1'
            // 与默认色板一致的令牌会被省略，运行时自动继承默认值
        },
        darkColor: {
            primary: '#CBB0F8'
            // ...
        }
    }
];

export default snakeThemePresets;
```

覆盖后，在应用入口通过主题配置注册即可（见 [多主题与暗黑模式](/guide/multi-theme)）：

```ts
app.use(SnakeUI, {
    theme: {
        themes: snakeThemePresets,
        defaultTheme: 'snake',
        defaultDarkMode: 'light'
    }
});
```

## 注意事项

- `name` 不能与内置主题（`snake`）或队列内主题重复，否则导出会被拦截。
- 未加入队列直接导出时，会导出当前配置的这一套主题。
- 暗黑值生成是启发式的，复杂品牌色建议在预览中核对后再导出。
- 工具配置会自动保存到本地浏览器，下次打开自动读取上次配置。
