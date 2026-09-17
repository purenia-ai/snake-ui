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

```vue
<script setup lang="ts">
import { http, useLocale, useTheme } from '@puresnake/snake-ui';

const { setLocale } = useLocale();
const { toggleDarkMode } = useTheme();

async function loadProfile() {
    return http.get<{ id: number }>('/profile', {}, { meta: { originalData: false } });
}
</script>
```

## 入口建议

| 场景                     | 入口                                            |
| ------------------------ | ----------------------------------------------- |
| 新的 TypeScript 代码     | 从 `@puresnake/snake-ui` 按需导入               |
| 模板中的简单提示或格式化 | `$snake`                                        |
| 旧 Options API 项目      | `uni.$snake` 或逐步改为按需导入                 |
| Vue 响应式状态           | `use*` 组合式函数（如 `useTheme` / `useColor`） |

不要同时维护自定义工具副本和 Snake UI 入口；先确认现有工具是否满足需求，再决定是否封装业务层。

`http` 默认返回完整响应，例子通过 `originalData: false` 显式获取数据体；请在业务 API 层统一约定。组合式函数应在 Vue 组件的 `<script setup>` 或其他有效的组件执行上下文中调用；路由、剪贴板和请求等能力依赖 uni-app 运行时。
