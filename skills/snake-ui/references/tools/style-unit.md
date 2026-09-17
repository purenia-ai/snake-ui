---
name: 'style-unit'
description: 'Snake UI 样式与单位参考。处理 style-unit、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['style-unit', '样式与单位']
---

# 样式与单位

这组工具统一处理 uni-app 尺寸和行内样式。

## 单位补全

```ts
import { addUnit } from '@puresnake/snake-ui';

addUnit(24); // 24rpx
addUnit('1rem'); // 1rem
addUnit('12 24px'); // 12rpx 24px
```

## 样式转换

```ts
import { addStyle, kebabCase, toStyle } from '@puresnake/snake-ui';

kebabCase('backgroundColor'); // background-color
addStyle('color:red;font-size:12px');
toStyle({ backgroundColor: '#fff' }, 'color:#222');
// background-color:#fff;color:#222
```

`toStyle` 后传入的声明覆盖同名属性；null、undefined 和空字符串不会写入结果。

## API 与边界

| 方法                                 | 行为                                                   |
| ------------------------------------ | ------------------------------------------------------ |
| `addUnit(value = 0, unit = 'rpx')`   | 给裸数字追加单位，含多值简写；空值返回 `0rpx`          |
| `kebabCase(name)`                    | 将驼峰、空格或下划线写法转换为 CSS 短横线写法          |
| `addStyle(style, target = 'object')` | 将声明串转为样式对象；`target = 'string'` 时返回字符串 |
| `toStyle(...styles)`                 | 合并样式对象或声明串，返回 CSS 声明串                  |

`addUnit` 只补全单位，不做 px 与 rpx 的比例换算。请按 uni-app 尺寸体系传入值；涉及页面宽度的换算要先确认设备视口。
