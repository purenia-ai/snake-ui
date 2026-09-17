---
name: 'platform'
description: 'Snake UI 平台辅助参考。处理 platform、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['platform', '平台辅助']
---

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

`toast` 默认展示 2000 ms，空标题不会调用平台 API；`sleep(delay = 0)` 返回延时 Promise。`clipboard` 只负责写入剪贴板，若业务需要自定义成功提示，应在成功后自行展示。

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

## API 与平台边界

| 方法                            | 返回值与说明                              |
| ------------------------------- | ----------------------------------------- |
| `clipboard(value)`              | `Promise<void>`；复制失败时拒绝           |
| `toast(title, duration = 2000)` | `void`；调用 `uni.showToast` 的无图标模式 |
| `sleep(delay = 0)`              | `Promise<void>`；按毫秒等待               |
| `getSystemInfo()/sys()`         | 实时读取的 uni-app 系统信息               |
| `os()`                          | 系统信息中的 `platform` 小写字符串        |
| `type2icon(type)`               | 与语义类型对应的图标名                    |

剪贴板、提示和系统信息依赖宿主 uni-app API；服务端或普通 Node 环境不能直接调用这些入口。
