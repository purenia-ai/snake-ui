# 颜色处理

颜色工具处理三位或六位十六进制颜色，并提供 RGB、RGBA 与渐变计算。

## 格式转换

```ts
import { colorToRgba, hexToRgb, rgbToHex } from '@puresnake/snake-ui';

hexToRgb('#06d290'); // { r: 6, g: 210, b: 144 }
rgbToHex(6, 210, 144); // #06d290
colorToRgba('#06d290', 0.5); // rgba(6, 210, 144, 0.5)
```

`rgbToHex` 会把通道取整并限制在 0–255；非法十六进制输入在 `colorToRgba` 中原样返回。

`hexToRgb` 接受带或不带 `#` 的三位、六位十六进制颜色，解析失败返回 `undefined`。`colorToRgba` 的 `alpha` 默认为 1，并限制在 0–1。需要读取当前主题色而非转换固定颜色时，使用[颜色管理](/tools/use-color)。

## 颜色渐变

```ts
import { colorGradient } from '@puresnake/snake-ui';

colorGradient('#000000', '#ffffff', 3);
// ['#000000', '#808080', '#ffffff']
```

`steps <= 0` 或颜色无效时返回空数组。

## API 速查

| 方法                               | 返回值                                   |
| ---------------------------------- | ---------------------------------------- |
| `hexToRgb(value)`                  | `{ r, g, b }` 或 `undefined`             |
| `rgbToHex(r, g, b)`                | 六位十六进制字符串                       |
| `colorToRgba(value, alpha = 1)`    | RGBA 字符串；无效颜色原样返回            |
| `colorGradient(start, end, steps)` | 渐变颜色数组；`steps = 1` 时只返回起点色 |
