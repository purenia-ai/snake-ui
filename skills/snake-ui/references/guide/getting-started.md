---
name: 'getting-started'
description: 'Snake UI 快速开始参考。处理 getting-started、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['getting-started', '快速开始']
---

# 快速开始

Snake UI 有两条接入路径：只使用通用 UI 组件，或将 CMS 页面装修能力接入已有商城。两条路径共用同一套安装、主题与基础运行时；先选择你的目标，再进入对应的详细步骤。

## 开始前确认

准备一个可正常运行的 uni-app Vue 3 项目，并确认项目可以处理 SCSS 与 `rpx`。完整的版本要求、平台差异和宿主能力见[运行环境与能力边界](/guide/compatibility)。

## 选择接入路径

::: info 基础组件接入
适合需要按钮、表单、导航、弹层和主题等通用能力的项目。

1. [安装 Snake UI](/components/install)。
2. 完成[工程配置](/components/setting)。
3. 按[第一个组件](/components/quickstart)渲染按钮、验证主题和全局工具。
4. 在[组件总览](/components/intro)中按分类或关键词选择后续组件。
   :::

::: tip CMS 页面接入
适合后端保存装修配置、前端按 JSON 渲染商城页面的项目。先完成基础组件接入，再继续：

1. 阅读[CMS 快速接入](/cms/getting-started)，渲染第一个页面配置。
2. 按[CMS 容器 API](/cms/overview)接入容器、事件与业务服务。
3. 根据[页面数据协议](/cms/data-contract)和[业务服务接入](/cms/services)对齐接口数据。
   :::

## 常用下一步

- 需要主题、语言、HTTP 或全局工具：[全局配置总览](/guide/foundation)。
- 需要确认跨端限制：[运行环境与能力边界](/guide/compatibility)。
- 接入或运行异常：[常见问题](/guide/troubleshooting)。
