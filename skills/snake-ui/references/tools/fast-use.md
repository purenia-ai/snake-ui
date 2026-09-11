---
name: 'fast-use'
description: 'Snake UI 快速使用参考。处理 fast-use、tools 或相关 uni-app 使用问题时按需读取。'
triggers: ['fast-use', '快速使用']
---

# 快速使用

工具无需单独安装。包根入口与 `@puresnake/snake-ui/libs` 都能按需导出公开能力，应用插件还会安装全局兼容入口。

## 按需导入

```ts
import { colorToRgba, debounce, route, timeFormat } from '@puresnake/snake-ui';

const submit = debounce(() => save(), 500);
const timestamp = timeFormat(Date.now(), 'yyyy-mm-dd');
await route('/pages/result/index', { at: timestamp });
```

这是组合式 API、业务模块和可测试代码的首选方式。

## 全局工具

```ts
import SnakeUI from '@puresnake/snake-ui';

app.use(SnakeUI);

uni.$snake.toast('已保存');
await uni.$snake.sleep(300);
```

模板中可直接使用 `$snake`，但复杂表达式应放回 `<script setup>`，避免模板承担业务流程。

## HTTP 与 Hooks

```ts
import { http, useLocale, useTheme } from '@puresnake/snake-ui';

const profile = await http.get<User>('/profile');
const { setLocale } = useLocale();
const { toggleDarkMode } = useTheme();
```

## 入口建议

| 场景                     | 入口                                            |
| ------------------------ | ----------------------------------------------- |
| 新的 TypeScript 代码     | 从 `@puresnake/snake-ui` 按需导入               |
| 模板中的简单提示或格式化 | `$snake`                                        |
| 旧 Options API 项目      | `uni.$snake` 或逐步改为按需导入                 |
| Vue 响应式状态           | `use*` 组合式函数（如 `useTheme` / `useColor`） |

不要同时维护自定义工具副本和 Snake UI 入口；先确认现有工具是否满足需求，再决定是否封装业务层。
