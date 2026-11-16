---
preview: /pages/componentsA/search/index
---

# Search 搜索框

搜索框集成占位、清除、右侧操作按钮与聚焦展开，一键引入开箱即用；支持圆形/方形、禁用跳转、输入框内左右插槽与 `ref` 方法调用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-search v-model="keyword" placeholder="请输入关键字" @search="handleSearch" @clear="handleClear" />
```

`search` 由键盘确认键触发，`custom` 由右侧操作按钮触发，两者都携带当前关键字。

## 形状与状态

```vue
<!-- 方形 + 描边：配置 borderColor 才会画边框，box-sizing 已按 border-box 处理，高度不会因边框增长 -->
<snake-search shape="square" height="34" :show-action="false" bg-color="#ffffff" border-color="#e4e7ed" />

<!-- 禁用态：输入框不可编辑，点击组件派发 click，通常用于跳转真正的搜索页 -->
<snake-search disabled placeholder="搜索商品" @click="goSearchPage" />

<!-- 聚焦时才展开右侧按钮 -->
<snake-search v-model="keyword" animation action-text="搜索" />
```

`disabled` 时清除控件不会显示，`focus` 请求也会被忽略。

## 清除与事件

清除控件**只要有内容就显示**，不依赖聚焦状态——输入后点空白处失焦，仍然可以一键清空：

- 点击清除会依次派发 `update:modelValue` / `input` / `change` / `clear`，`clear` 触发时 `modelValue` 已经是空串；
- `ref.clear()` 与点击清除走同一套逻辑；
- 程序化修改 `modelValue`（点热词、重置表单）只同步显示，**不会**回派 `input` / `change`。

```vue
<snake-search v-model="keyword" placeholder="请输入关键字" @input="querySuggestions" @clear="suggestions = []" />
```

## 插槽

`#left` 替换左侧搜索图标（扫码、返回箭头等），`#right` 挂在清除控件之后（语音、相机等附加入口）：

```vue
<snake-search v-model="keyword" placeholder="搜索附近门店">
    <template #left>
        <snake-icon name="scan" :size="16" color="var(--snake-color-text-secondary, #606266)" />
    </template>
    <template #right>
        <view class="my-search-extra">
            <snake-icon name="mic" :size="16" color="var(--snake-color-text-muted, #909399)" />
        </view>
    </template>
</snake-search>
```

插槽内容直接成为输入框容器里的 flex 子项，宽度由内容决定；需要间距时给插槽根节点自己加 `padding`。

## 右侧操作按钮

`actionText` 定文案，`actionStyle` 只改按钮外观，显隐仍由 `showAction` / `animation` 控制——因此可以用它做胶囊按钮或「取消」：

```vue
<!-- 常驻胶囊按钮 -->
<snake-search
    v-model="keyword"
    action-text="搜索"
    :action-style="{
        width: '56px',
        height: '30px',
        lineHeight: '30px',
        borderRadius: '999px',
        background: '#0f5f55',
        color: '#ffffff',
        fontWeight: 600,
        marginLeft: '8px'
    }"
    @custom="handleSearch"
/>

<!-- 收起时隐藏：actionStyle 不会把按钮带出来 -->
<snake-search :show-action="false" :action-style="{ width: '56px' }" />
```

展开宽度上限由主题变量 `--snake-search-action-max-width` 控制（默认 200px），按钮更宽时调大它。

## 方法调用

```vue
<snake-search ref="searchRef" v-model="keyword" :show-action="false" />

<script setup lang="ts">
import { ref } from 'vue';
import type { SearchExpose } from '@puresnake/snake-ui';

const searchRef = ref<SearchExpose>();

searchRef.value?.focus(); // 聚焦，disabled 时不生效
searchRef.value?.blur(); // 失焦并收起键盘
searchRef.value?.clear(); // 清空并派发 update:modelValue / input / change / clear
</script>
```

## API

### Props

| 参数               | 说明                                                                                                 | 类型               | 默认值         |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------------------ | -------------- |
| `customStyle`      | 根节点自定义样式                                                                                     | `StyleValue`       | `''`           |
| `customClass`      | 根节点自定义类名                                                                                     | `string`           | `''`           |
| `shape`            | 搜索框形状，可选值 `round`（圆形）/ `square`（方形）                                                 | `SearchShape`      | `round`        |
| `bgColor`          | 搜索框背景色                                                                                         | `string`           | 主题浅色表面   |
| `borderColor`      | 边框颜色，配置后才画边框                                                                             | `string`           | `''`           |
| `placeholder`      | 占位提示文字                                                                                         | `string`           | 语言包默认值   |
| `clearabled`       | 是否启用清除控件，有内容即显示                                                                       | `boolean`          | `true`         |
| `focus`            | 是否自动聚焦，之后变为 `true` 也会重新聚焦                                                           | `boolean`          | `false`        |
| `showAction`       | 是否在搜索框右侧显示操作按钮                                                                         | `boolean`          | `true`         |
| `actionStyle`      | 右侧操作按钮样式（只改外观，不影响显隐）                                                             | `StyleValue`       | `{}`           |
| `actionText`       | 右侧操作按钮文字                                                                                     | `string`           | 语言包默认值   |
| `inputAlign`       | 输入框内容水平对齐方式，可选值 `left` / `center` / `right`                                           | `SearchInputAlign` | `left`         |
| `disabled`         | 是否禁用输入框，禁用时点击组件派发 `click`                                                           | `boolean`          | `false`        |
| `animation`        | 开启 `showAction` 时，是否仅在输入框聚焦时才展开操作按钮                                             | `boolean`          | `false`        |
| `modelValue`       | 双向绑定的输入值（v-model）                                                                          | `string`           | `''`           |
| `height`           | 搜索框高度，数值按 px（375 稿）处理                                                                  | `UnitValue`        | `32`           |
| `inputStyle`       | 输入框的样式，可定义文字颜色、大小等                                                                 | `StyleValue`       | `{}`           |
| `maxlength`        | 输入框最大能输入的长度，`-1` 为不限制                                                                | `UnitValue`        | `-1`           |
| `searchIconColor`  | 搜索图标的颜色，默认同输入框字体颜色                                                                 | `string`           | `''`           |
| `searchIcon`       | 左侧图标名，可被 `#left` 插槽覆盖                                                                    | `string`           | `search`       |
| `color`            | 输入框字体颜色                                                                                       | `string`           | 主题次要文字色 |
| `placeholderColor` | placeholder 的颜色                                                                                   | `string`           | 主题占位色     |
| `margin`           | 与上下左右元素的间距，带单位的字符串形式                                                             | `string`           | `'0'`          |
| `adjustPosition`   | 弹出键盘时是否自动调节高度                                                                           | `boolean`          | `true`         |
| `type`             | 输入框类型，可选值 `text`（文本）/ `number`（数字键盘）/ `idcard`（身份证）/ `digit`（带小数点数字） | `SearchInputType`  | `'text'`       |

### Events

| 事件名              | 触发时机                                     | 参数    |
| ------------------- | -------------------------------------------- | ------- |
| `update:modelValue` | 输入值变化（v-model）                        | `value` |
| `input`             | 用户输入、点击清除时触发                     | `value` |
| `change`            | 同 `input`                                   | `value` |
| `search`            | 键盘确认搜索                                 | `value` |
| `custom`            | 点击右侧操作按钮                             | `value` |
| `clear`             | 点击清除控件或调用 `clear()`，此时值已为空串 | -       |
| `focus`             | 输入框获得焦点                               | `value` |
| `blur`              | 输入框失去焦点                               | `value` |
| `click`             | `disabled` 时点击搜索框                      | -       |

### Slots

| 插槽名  | 说明                                     |
| ------- | ---------------------------------------- |
| `left`  | 替换左侧搜索图标                         |
| `right` | 清除控件之后的附加内容，如语音、相机入口 |

### Expose

| 方法    | 说明                                                                |
| ------- | ------------------------------------------------------------------- |
| `focus` | 聚焦输入框，`disabled` 时不生效                                     |
| `blur`  | 让输入框失焦并收起键盘                                              |
| `clear` | 清空输入，并派发 `update:modelValue` / `input` / `change` / `clear` |

## 主题变量

| 变量名                            | 说明                       | 默认值       |
| --------------------------------- | -------------------------- | ------------ |
| `--snake-color-surface-muted`     | 搜索框默认背景色           | 主题浅色表面 |
| `--snake-color-text-secondary`    | 输入文字与搜索图标默认颜色 | `#606266`    |
| `--snake-color-text-muted`        | 占位文字默认颜色           | `#909399`    |
| `--snake-color-text-light`        | 清除图标颜色               | `#c0c4cc`    |
| `--snake-color-text`              | 右侧操作按钮文字颜色       | `#303133`    |
| `--snake-search-action-max-width` | 右侧操作按钮展开宽度上限   | `200px`      |

## 注意

- 输入框内容以组件内部值为准，`:model-value` 变化只同步显示；因此不使用 `v-model` 的「非受控」写法也能正常输入，但要拿值请监听 `input` 或使用 `v-model`。
- `disabled` 同时用于「假输入框」场景：整块可点、派发 `click`，再跳转真正的搜索页；此时右侧操作按钮仍然可点并派发 `custom`。
- 输入联想请在 `@input` 里做防抖，程序化赋 `modelValue` 不会触发 `input`，不会造成重复请求。
- 清除控件与输入框是同级 flex 子项，`#right` 内容请保持 `flex: none`，否则会挤压输入区。
