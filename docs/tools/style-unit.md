# 样式与单位

这组工具统一处理 uni-app 尺寸和行内样式。

## 单位补全

```ts
import { addUnit } from '@puresnake/snake-ui';

addUnit(24); // 24rpx
addUnit('1rem'); // 1rem
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
