# 扩展图标库

Snake UI 内置了一套字体图标（见 [Icon 图标](/components/icon) 的图标集），覆盖常用业务场景，但无法覆盖所有项目的需求。当内置图标不够用时，有两种扩展方式：用 `custom-prefix` 接入自己的字体图标，或把第三方图标合并进内置字体。

## 方式一：自定义字体图标

`snake-icon` 的 `customPrefix` 属性支持接入任意字体图标库。渲染时类名由 `${customPrefix}-${name}` 拼接，字体族默认使用 `customPrefix` 的值（内置前缀 `sicon` 特例使用 `snake-iconfont`）。

### 准备图标库

以阿里 iconfont 为例，建议把项目需要的扩展图标都收集进同一个图标库项目：

1. 在 iconfont 图标管理中创建或选择一个项目，进入「更多操作 → 编辑项目」。
2. 把 **FontClass/Symbol 前缀** 改为固定前缀（如 `custom-icon-`），**Font Family** 改为对应的字体族名（如 `custom-icon`）。改一次前缀，后续新增图标就不用反复修改 CSS。
3. 下载项目至本地，解压后把 `iconfont.css` 复制到项目 `static` 目录（也可放其他目录，注意引入路径即可）。
4. 打开 `iconfont.css`，删除注释和无用内容，把 `src: url('data:application/x-font-woff2......')` 末尾的逗号改为分号。

### 全局引入

在 `App.vue` 的 `<style>` 中引入，`@import` 必须写在 style 标签有效内容的最前面：

```css
/* App.vue */
<style>
/* 此处为 style 标签内容的最前面 */
@import "./static/iconfont.css";

.page {
    /* 其他样式 */
}
</style>
```

### 使用

图标名称对应 iconfont 项目里每个图标的 Font Class 值（修改后需重新下载覆盖 `iconfont.css`）：

```vue
<snake-icon name="backspace" custom-prefix="custom-icon" size="30" color="#888888" />
```

与内置图标相比只多了 `custom-prefix`，其余用法完全一致。图标渲染为单色，`color` 即图标颜色。

## 方式二：合并进内置字体

当扩展的是插画类图标（如空状态插画），并希望与内置 `sicon-` 前缀保持统一时，可以使用仓库脚本 `scripts/merge-empty-icons.py`，把第三方图标字体合并进内置字体。

### 工作流

```bash
python scripts/merge-empty-icons.py \
    --source "D:/path/to/third-party/iconfont.css" \
    --css "src/uni_modules/snake-ui/iconfont.css" \
    --font "src/uni_modules/snake-ui/iconfont.woff2"
```

脚本会：

1. 提取源 CSS 中内嵌的 base64 woff2 字体。
2. 找到源 CSS 中所有 `.uicon-empty-<mode>:before` 规则及其码位。
3. 把码位重映射到新的私有区段，避免与目标字体已用码位冲突。
4. 把源字体的这些字形子集化合并进目标 woff2（轮廓、度量与 cmap 一并拷贝）。
5. 向目标 CSS 追加 `.sicon-empty-<mode>:before` 规则。追加是幂等的，重复执行会先移除旧规则。

合并后的图标直接按内置前缀使用：

```vue
<snake-icon name="empty-loading" />
```

### 约束

- 源字体必须与内置字体同为 iconfont.cn 构建（`unitsPerEm` 为 1024），否则字形度量不一致。
- 脚本面向 empty 插画类字形；普通功能性图标优先使用方式一，避免改动物料仓库。

## 注意事项

- **只用单色图标**：多色图标在字体渲染中会变成单色。
- **`@import` 位置**：必须位于 `<style>` 有效内容的最前面，写在其他样式之后会被忽略。
- **新增图标要重走流程**：iconfont 里每次新增图标，都要重新下载并覆盖 `iconfont.css`，再执行一遍清理步骤。
- **前缀与字体族一一对应**：一个 `customPrefix` 对应一个 `@font-face` 字体族，不要把不同字体的类名混用同一个前缀。

## 下一步

- 内置图标全集：[Icon 图标](/components/icon)
- 组件外观定制：[自定义样式](/guide/custom-style)
