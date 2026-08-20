---
preview: /pages/componentsB/commodity-search
cms: true
---

# 商品搜索 <span class="cms-badge">CMS</span>

提供可吸顶的商城搜索栏，支持输入搜索、热词轮播、右侧图片和快捷图标。

## 运行前提

依赖 Vue `getCurrentInstance`、Snake Icon、Snake NoticeBar，以及 `uni.$snake.sleep`、`getRect`、`navTo`、`toast`。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-commodity-search
    :datas="{
        position: 0,
        backgroundColor: '#ffffff',
        pageMargin: 24,
        heights: 72,
        borderBgColor: '#f3f6f4',
        borderRadius: 36,
        showBorder: false,
        textColor: '#7b8780',
        searchText: '搜索商品',
        isSearch: true,
        inputType: 'text',
        url: '/pages/search/index?keyword=',
        textList: [],
        rightImage: { show: false, marginRight: 0 },
        iconImgList: []
    }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数    | 说明                 | 类型     | 默认值 | 可选值 |
| ------- | -------------------- | -------- | ------ | ------ |
| `datas` | 搜索栏内容和样式配置 | `Object` | 未声明 | -      |

### 主要 `datas` 字段

| 字段                                       | 说明                                                   |
| ------------------------------------------ | ------------------------------------------------------ |
| `position`                                 | 为 `1` 时固定在页面顶部并保留占位高度                  |
| `backgroundColor`、`pageMargin`            | 外层背景与水平间距                                     |
| `heights`、`borderBgColor`、`borderRadius` | 搜索框尺寸和外观                                       |
| `showBorder`、`borderSize`、`borderColor`  | 搜索框边框配置                                         |
| `textColor`、`searchText`                  | 图标与占位文案                                         |
| `isSearch`、`inputType`、`url`             | 是否允许输入、输入类型及搜索/点击跳转前缀              |
| `textList`                                 | 热词数组，每项读取 `text`、`url`                       |
| `rightImage`                               | 搜索框内右图，读取 `show`、`src`、尺寸、圆角和右边距   |
| `iconImgList`                              | 搜索框右侧快捷图片数组，读取 `id`、`src`、尺寸和 `url` |

组件不向父级发送事件；确认搜索和点击均直接导航。

## 注意事项

`textList`、`rightImage`、`iconImgList` 在模板和挂载逻辑中被直接访问，调用方应提供完整默认结构。H5 固定定位默认偏移 `44px`，其他非微信平台为 `0`。

源码：`src/uni_modules/snake-ui/components/snake-commodity-search/snake-commodity-search.vue`
