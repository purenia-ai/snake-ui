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

## 颜色渐变

```ts
import { colorGradient } from '@puresnake/snake-ui';

colorGradient('#000000', '#ffffff', 3);
// ['#000000', '#808080', '#ffffff']
```

`steps <= 0` 或颜色无效时返回空数组。
