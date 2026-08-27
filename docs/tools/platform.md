# 平台辅助

平台工具封装常见 uni-app 能力，调用前应确认目标平台提供对应 API。

## 剪贴板、提示与等待

```ts
import { clipboard, sleep, toast } from '@puresnake/snake-ui';

await clipboard('SNK-2026');
toast('复制成功');
await sleep(300);
```

`clipboard` 在 API 不可用或调用失败时拒绝 Promise；`toast(title, duration)` 使用无图标轻提示。

## 系统信息

```ts
import { getSystemInfo, os, sys } from '@puresnake/snake-ui';

const info = getSystemInfo();
sys(); // getSystemInfo 的便捷入口
os(); // 小写 platform 字符串
```

## 状态图标

```ts
import { type2icon } from '@puresnake/snake-ui';

type2icon('success'); // checkmark-circle
```

支持 `success`、`warning`、`error` 和 `info`，未知值回退到信息图标。
