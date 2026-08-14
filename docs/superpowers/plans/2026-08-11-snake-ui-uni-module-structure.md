# Snake UI uni_modules 结构规范化实施计划

## 目标

按照已确认的设计，将 Snake UI 公开组件改为 easycom 标准目录，补齐模块元数据和导出入口，并同步文档与工程脚本。

## 步骤

1. 建立 20 个 `components/snake-*/snake-*.vue` 目标目录，将现有公开组件直接移动到新位置。
2. 保留 `filter-page.vue` 与 `tree-select` 为内部组件，并修正移动后受影响的相对引用。
3. 搜索项目中的旧路径、旧组件标签及相对导入，逐项更新或确认不属于公开 API。
4. 在 `src/pages.json` 配置 `<snake-*>` easycom 映射。
5. 新增模块 `package.json`、`index.ts`、`readme.md` 和 `changelog.md`。
6. 更新根工程元数据和 VitePress 桥接脚本；在 VitePress 中排除 `superpowers/**`。
7. 同步 20 个组件文档的组件名、示例标签和源码路径。
8. 运行结构检查、JSON 解析、旧路径扫描、VitePress 构建；在环境允许时运行 uni-app H5 构建并记录既有依赖阻塞。

## 保护措施

- 不创建旧路径兼容文件。
- 不改写组件内部业务逻辑。
- 不安装新依赖，不修改锁文件中的依赖解析结果。
- 不把缺失的宿主请求、缓存、配置或组件伪造成可运行实现。
