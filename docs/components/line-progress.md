---
preview: /pages/componentsA/lineProgress/index
---

# LineProgress 线形进度条

以线形进度展示操作或任务的当前进度，比如上传文件，支持主题色预设、条纹与百分比展示。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-line-progress :percent="40" />
<snake-line-progress :percent="60" :active-color="'#06D290'" />
```

## 条纹与预设

```vue
<!-- 主题预设，type 设置后 activeColor 失效 -->
<snake-line-progress :percent="30" type="primary" />
<!-- 静态/动态条纹 -->
<snake-line-progress :percent="50" striped />
<snake-line-progress :percent="70" striped striped-active />
```

进度条内部默认展示百分比，通过 `show-percent="false"` 关闭；传入默认插槽可完全替换内部内容。

## API

### Props

| 参数            | 说明                              | 类型                                             | 默认值                  |
| --------------- | --------------------------------- | ------------------------------------------------ | ----------------------- |
| `percent`       | 进度百分比，数值 0-100            | `number \| string`                               | `0`                     |
| `round`         | 两端是否显示半圆形                | `boolean`                                        | `true`                  |
| `type`          | 主题预设，设置后 activeColor 失效 | `primary \| success \| warning \| error \| info` | `''`                    |
| `activeColor`   | 激活部分的颜色                    | `string`                                         | `--snake-color-success` |
| `inactiveColor` | 进度条的底色                      | `string`                                         | `--snake-color-divider` |
| `showPercent`   | 是否在进度条内部显示百分比        | `boolean`                                        | `true`                  |
| `height`        | 进度条高度，数值按 rpx 处理       | `number \| string`                               | `28`                    |
| `striped`       | 是否显示激活部分的条纹            | `boolean`                                        | `false`                 |
| `stripedActive` | 条纹是否具有动态效果              | `boolean`                                        | `false`                 |

### Slots

| 名称    | 说明                     |
| ------- | ------------------------ |
| default | 替换进度条内部默认百分比 |

## 主题变量

| 变量名                     | 说明                      |
| -------------------------- | ------------------------- |
| `--snake-color-divider`    | 轨道默认颜色              |
| `--snake-color-primary`    | primary 预设颜色          |
| `--snake-color-success`    | 默认激活色及 success 预设 |
| `--snake-color-warning`    | warning 预设颜色          |
| `--snake-color-error`      | error 预设颜色            |
| `--snake-color-info`       | info 预设颜色             |
| `--snake-color-white`      | 进度文字颜色              |
| `--snake-color-text-light` | 条纹装饰颜色              |
