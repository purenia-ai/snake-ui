# 工具

Snake UI 把网络请求、通用函数、uni-app 平台封装和组合式函数放在同一个工具域中。每项能力拥有独立页面，便于搜索、收藏和逐项核对。

## 能力地图

| 分组       | 适合解决的问题                          | 推荐入口                     |
| ---------- | --------------------------------------- | ---------------------------- |
| 网络       | 请求配置、拦截器、统一错误处理          | [HTTP 请求](/tools/http)     |
| 工具库     | 数据、时间、路由、颜色和平台能力        | [快速使用](/tools/fast-use)  |
| 组合式函数 | 在 Vue 组件中使用主题、语言、弹窗等能力 | [主题管理](/tools/use-theme) |

## 选择调用方式

可复用模块优先按需导入，类型提示最完整，也更容易测试：

```ts
import { debounce, deepMerge, route } from '@puresnake/snake-ui';
```

安装 Snake UI 后，模板、Options API 和迁移代码也可以使用 `$snake`：

```ts
uni.$snake.toast('操作完成');
await uni.$snake.route('/pages/order/detail', { id: 1 });
```

## 平台边界

纯函数可以在普通 TypeScript 模块中运行。路由、节点、剪贴板、Toast 和 HTTP 默认传输层依赖对应的 uni-app API；具体限制在各能力页面说明。

## 从这里开始

- 新项目先阅读[快速使用](/tools/fast-use)，确定统一的导入约定。
- 接口接入查看[HTTP 请求](/tools/http)。
- 页面跳转查看[路由跳转](/tools/route)，高频调用节流查看[节流与防抖](/tools/debounce-throttle)。
