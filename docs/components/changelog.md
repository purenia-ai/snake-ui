# 更新日志

## [0.1.2](https://github.com/purenia-ai/snake-ui/compare/v0.1.1...v0.1.2)（2026-11-26）

### 🐛 Bug Fixes | 修复

- **snake-textarea:** 原生 `<textarea>` 不再用百分比高度。`height: 100%` 在 iOS 小程序里会被算成整页高度，页面被异常拉长；同层渲染未生效时这层原生视图盖在整个 WebView 之上（`z-index` 无法覆盖），底部 `position: fixed` 的按钮点击会被吞掉，且开发者工具与安卓端都复现不出来。现在固定高度按档位高度扣掉容器上下内边距与边框给出确定值，`auto-height` 用 `height: auto` 加档位下限
- **snake-textarea:** `height` 小于档位高度时不再被档位的 `min-height` 顶回去

### ⚙️ Changes | 变更

- **snake-textarea（行为变更）:** `--snake-textarea-native-height` / `--snake-textarea-native-height-small` / `--snake-textarea-native-height-large` 收窄为「仅 `auto-height` 时的原生控件下限」，固定高度档位不再引用；默认值与换算结果不变（80 / 64 / 112 减 33 分别等于 47 / 31 / 79），默认视觉无变化
- **version:** 版本号进入 `0.1.2`

### ✏️ Documentation | 文档

- 「尺寸与高度」只保留用法，百分比高度的成因与 `height - 33px` 的换算移入源码注释

## [0.1.1](https://github.com/purenia-ai/snake-ui/compare/v0.1.0...v0.1.1)（2026-11-16）

### ✨ Features | 新功能

- **snake-select-picker:** 新增单复选选择器：底部弹层内列表勾选，`multiple` 默认单选，`v-model` 承载选中值、`v-model:visible` 控制开合；支持本地搜索（命中高亮）、`min` / `max` 数量限制、`beforeConfirm` 异步确认、`loading` 与空态；复用 `snake-popup` / `snake-search` / `snake-button` / `snake-loading`，自绘行与选中指示器，并接入 `snake-form-item` 的校验与禁用
- **snake-checkbox / snake-radio:** 新增 `inactiveColor`（未选中边框色）、`placement`（`left` / `right`，指示器在右由 `row-reverse` + `space-between` 实现，配 `wrap` 即「标签左、指示器右」的设置行）、`border`（行分隔线，只画在项与项之间，末项靠 `useParent` 的 `index` 判断而不依赖 `:last-child`）、`labelColor`
- **snake-checkbox:** 新增 `indeterminate` 半选：复用 `minus` 图标，`aria-checked="mixed"`，强调色与选中态一致
- **snake-checkbox-group:** 新增 `min`（达下限后已选项锁定，误点给一次轻提示）；新增 `toggleAll({ checked, skipDisabled })` 批量勾选/取反，结果受 `min` / `max` 约束，`setAllChecked` 保留为别名
- **snake-checkbox-group / snake-radio-group:** 新增分组级 `labelSize` / `labelColor` / `placement` / `border` / `inactiveColor`，子项可逐项覆盖
- **snake-checkbox / snake-radio:** 补齐无障碍与键盘：子项 `role`、`aria-checked`（半选 `mixed`）、`aria-disabled`、`tabindex` 与 `Enter` / `Space`；分组 `role="radiogroup"` / `role="group"`；按压反馈走 `hover-class`，只缩放图标不动布局
- **snake-picker:** 新增 `immediateChange`：透传原生 `picker-view` 的 `immediate-change`，手指松开即派发 `change`，不再等滚动动画结束；按 uni-app 平台表仅微信小程序（基础库 2.21.1+）生效

### 🐛 Bug Fixes | 修复

- **snake-checkbox / snake-radio:** 自定义数值 `size` 完全失效（落在预设档位之外时静默回落到 17px），现在按数值解析盒子高度，勾号约 0.59×、字号约 0.82×，非预设尺寸的图标也不再固定 20
- **snake-checkbox / snake-radio:** 禁用态只有图标变灰、标签仍是正常文字色，现在标签同步降到 `--snake-color-text-muted`
- **snake-checkbox-group:** 达到 `max` 时只弹一次 toast、且文案硬编码中文，现在未选项进入锁定态（`--locked`，与真正的 `disabled` 分开，仍可聚焦并解释原因），文案走语言包 `maxText` / `minText`（`{n}` 占位）并可用同名属性覆盖
- **snake-checkbox-group:** `validateSelection()` 会在取值时弹出提示，现在改为纯判定；`setAllChecked()` 不再 `console.warn`，也不再无视 `min` / `max`
- **snake-checkbox-group / snake-radio-group:** `width` 契约不一致（一个裸 `string`，一个给每个子项强塞 `width:auto; float:left`），现在统一为 `UnitValue` + `addUnit`，并把 `'auto'` 定义为「不设置宽度」
- **snake-checkbox-group:** 删除从未实现的 `name` 属性（表单取值一直走 `form-item` 的 `prop`）
- **snake-image:** 加载态兜底不再用 `<snake-loading>` 动画：`loadingIcon` 默认值改为 `photo`，与失败态的 `error-circle` 对称；新增 `statusSize` 跟随容器短边取一半并收敛到 12–24（`%` / `vh` / `auto` 回落 24）；动画改为显式声明（`loading` 插槽，或 `loading-icon` / `loading-img`）

### ⚙️ Changes | 变更

- **snake-checkbox-group（行为变更）:** `CheckboxGroupProps.name` 移除；`width` 默认 `'auto'` 现在表示不设置宽度，radio 子项不再默认带 `float:left`
- **snake-checkbox-group（行为变更）:** `validateSelection()` 只返回布尔值，不再弹提示；`toggleAll` / `setAllChecked` 的返回值受 `min` / `max` 约束
- **snake-checkbox / snake-radio（行为变更）:** 禁用与锁定项的标签文字颜色由 `--snake-color-text` 改为 `--snake-color-text-muted`
- **snake-picker:** `immediateChange` 默认 `false`，与原生默认一致，不开时行为不变
- **version:** 版本号进入 `0.1.1`

### ✏️ Documentation | 文档

- 新增 `snake-select-picker` 与 `snake-image` 加载态设计文档；重写 `checkbox` / `radio` 组件文档与示例页（各 5～7 个 preview 区块、10～11 项参数面板）
- 移除 `snake-picker` 文档里关于组件旧名的说明

## [0.1.0](https://github.com/purenia-ai/snake-ui/compare/v0.0.20...v0.1.0)（2026-11-16）

### ✨ Features | 新功能

- **snake-skeleton:** 新增 `animation`（`shimmer` / `pulse` / `none`），旧的 `animated` 布尔开关保留兼容且优先级更低；`pulse` 只动透明度、交给合成层处理，长列表与低端机上比逐帧重绘背景的 `shimmer` 更省
- **snake-skeleton:** 新增 `label` 无障碍文案：`loading` 时写入根节点 `aria-label` 并补 `aria-busy`，快速模式的占位块整体 `aria-hidden`，读屏不再逐个朗读空块
- **snake-skeleton:** `snake-skeleton-item` 新增 `size`（宽高同值），圆形/方形占位不必再写两遍尺寸，显式 `width` / `height` 仍然优先
- **snake-tag:** 新增标签组件：主题、尺寸、镂空、圆角、可关闭与左侧图标（`icon` 与 `icon` 插槽二选一）；默认档位 24px 高 / 12px 字号（对齐 wot-ui，`medium` / `small` / `mini` 依次 20 / 18 / 16px）；镂空描边由 `::after` 缩放 50% 绘制，`hairLine` 可关闭；实心态用 `customStyle` 自定义背景色时描边自动透明（与 `snake-button` 一致），关闭图标由原生 `view` 承载并把点击热区扩到 18px
- **snake-action-sheet:** 新增动作面板：基于 `snake-popup` 的底部动作列表，支持标题说明、图标、`disabled`/`loading` 拦截 `select`、`common.cancel` 兜底文案，并暴露 `open` / `close`
- **snake-action-sheet:** 新增 `action-item` 作用域插槽用于自定义单行内容（行容器、点击与关闭逻辑仍由组件负责）；`loading` 行改为渲染 `snake-loading` 转圈并保留文案，不再只做整行置灰
- **snake-steps / snake-step:** 新增步骤条：横向与纵向排列，状态由父级 `current` 推导、可用 `status` 覆盖；已完成显示对勾、异常显示叉号并染红标题，`icon` 与 `#icon` 插槽可覆盖图形；新增 `dot` 点状模式；连接线由独立节点按指示器尺寸绘制，不做 JS 测量
- **snake-collapse / snake-collapse-item:** 新增折叠面板：单值与数组统一归一化、手风琴模式、`max-height` 过渡；子项支持 `title` / `value` / `icon` 三类插槽
- **snake-grid / snake-grid-item:** 新增宫格：按列数等分宽度，外框与内线分绘，`square` 用 `padding-top` 撑正方形，支持角标、禁用与点击派发；新增 `--snake-grid-item-padding` 用于给角标溢出与圆角裁剪留缓冲
- **snake-swipe-action:** 新增滑动操作：左右两侧按钮（`actions` / `leftActions`，或 `#actions` / `#left` 插槽），方向锁定后接管横向手势、纵向手势放行给页面滚动；支持 `v-model` 停留状态、`beforeClose` 关闭前拦截、同组互斥，暴露 `open` / `close` / `refresh`；按钮区宽度按实测值展开，插槽按钮可用任意宽度
- **libs:** 新增 `useTouch` 手势 hook：记录位移并按阈值锁定方向，供滑动类组件复用

### 🐛 Bug Fixes | 修复

- **snake-skeleton:** 快速模式的默认尺寸只有参考实现的一半（标题 9px / 段落 8px / 头像 16px，是 0.0.6 单位迁移时机械折半的结果），灰条细得不像文字行、头像小得像圆点；现在对齐 wot-ui / uView-Pro 的量级：标题 16px、段落 12px、头像 32px
- **snake-skeleton:** 占位色此前是半透明中性灰叠加，浅色下比两家都更暗、深色下又偏亮；现在取主题的 muted 表面色（`--snake-color-surface-muted`，浅色 `#F1F1F1` / 暗色 `#1A1A1A`，与 uView-Pro 的 `#F1F2F4`、wot-ui 的 `#E5E6EB` 同量级），明暗模式自动切换
- **snake-skeleton:** 流光高亮带改为半透明叠加（`--snake-skeleton-highlight`，默认 `rgba(120,120,130,0.12)`）：「透明 → 高亮 → 透明」压在底色上，浅色底扫出更深的带（对齐 uView-Pro 的 `#E6E6E6`）、深色底扫出更亮的带（对齐 wot-ui 的 `#F7F8FA`）；系统开启「减少动态效果」时连静止的高亮带一起去掉
- **snake-skeleton:** `snake-skeleton-item` 的 `width` / `height` / `radius` 默认值此前以内联样式写死，未传 props 时主题变量对占位块的尺寸与圆角完全无效；现在只有显式传值才写内联样式，其余交给形态类名读取 `--snake-skeleton-*`
- **snake-skeleton:** 快速模式的头像间距与段落间距是内联 `margin`，无法主题化；现在改为 `--snake-skeleton-avatar-gap` / `--snake-skeleton-title-gap` / `--snake-skeleton-row-gap` 三个变量，默认值与旧表现一致
- **snake-search:** 清除控件改为「有内容就显示」，不再依赖聚焦：原实现是 `v-if="keyword && clearabled && focused"`，输入后点空白处失焦按钮即消失，只能再点一次输入框才能清空；顺带移除了靠 100ms 延时抢点击的 blur hack
- **snake-search:** 程序化修改 `modelValue` 不再回派 `input` / `change`：原实现在 `watch(keyword)` 里派发，父组件从外部赋值（点热词、重置表单）会触发一次假的输入事件，业务在 `@input` 里做防抖请求时会多发一次
- **snake-search:** 右侧操作按钮的显隐与 `actionStyle` 解耦：原实现把 `actionStyle` 内联到按钮同一个节点，内联 `width` 永远压过 `.snake-search__action` 的 `width: 0`，`showAction=false` 仍会显示按钮、`animation` 永远收不起来（消费方用 `actionStyle` 传 `width` 即中招）；现在外层容器用 `max-width` + `opacity` 控制展开，`actionStyle` 落在内层按钮上
- **snake-search:** 容器补 `box-sizing: border-box`：配置 `borderColor` 后高度多出 2px（32 → 34），与同级输入框对不齐
- **snake-search:** 补 `defineExpose`（`focus` / `blur` / `clear`）：原实现只有内部 `clear()`，注释写着「也可通过 ref 调用」但从未暴露，`ref.clear()` 必然报错
- **snake-search:** `maxlength` 归一：传空串等非法值不再得到 `0`（等于无法输入），统一按 `-1` 不限制处理
- **snake-search:** `disabled` 时补原生 `:disabled` 并隐藏清除控件，禁用状态下的 `focus` 请求直接忽略；输入框与容器补 `min-width: 0`，320px 窄屏不再溢出
- **snake-input:** 清除按钮改为「有内容就显示」，不再依赖聚焦：原实现 `clearable && focused`，输入后点空白处失焦按钮即消失，只能再点一次输入框才能清空；需要旧行为可传 `clear-trigger="focus"`
- **snake-input:** 格式化后回写原生值：原实现只更新 `innerValue` 与 `v-model`，被 `formatter` 过滤掉的字符仍留在输入框里（实测输入 `1a2b3c4d` 后输入框显示 `1a2b3c4d`、模型却是 `123`），现在先同步原生值再异步回写格式化结果，输入框与模型始终一致
- **snake-input:** 清除与密码图标的点击热区由 14×14 扩大到 24×整行高，并阻止冒泡——原实现点图标会连带派发根节点的 `click`
- **snake-input / snake-textarea:** 失焦不再重复派发 `input` / `update:modelValue`：原实现每次失焦都会用当前值再派发一遍，业务在 `@input` 里做防抖请求时会多发一次；`change` 也改为「失焦且值确实变化」才派发，与文档一致
- **snake-input / snake-textarea:** 输入法合成被失焦打断时（`compositionstart` 后直接 `blur`，`compositionend` 不再触发）`composing` 不会复位，之后的输入会被永久吞掉；现在失焦兜底复位
- **snake-textarea:** 字数统计改为按码点计数：`String.length` 会把 emoji 与生僻字算成 2，实测输入两个 emoji 显示 `4/80`
- **snake-input / snake-textarea:** `readonly` 的点击不可达：原生输入框被 `disabled` 后会吞掉点击（小程序端尤其明显），现在 `readonly` 渲染透明遮罩承接并派发 `click`，「点输入框打开选择器」可用；`disabled` 则彻底不派发 `click`（对齐 uView）
- **snake-input / snake-textarea:** 补 `defineExpose`（`focus` / `blur` / `clear`）：此前无法通过 ref 聚焦或清空，下一步输入、验证码等流程只能靠用户手点
- **snake-input / snake-textarea:** `defineOptions` 补 `addGlobalClass: true`，与库内其他组件一致
- **snake-textarea:** `size` 属性此前完全无效：模板里拼了 `snake-textarea--small/--large` 类名，但样式表里没有对应规则，三档尺寸渲染完全一致；现在按档位缩放高度（64 / 80 / 112）与字号（13 / 14 / 16）
- **snake-textarea:** `height` 属性此前形同虚设：默认 `60` 被样式里的 `min-height: 80px` 顶掉，实际永远 80；现在 `height` 同时写容器与原生控件的最小高度，小于档位高度也不会溢出
- **snake-input:** `size` 此前只改最小高度，字号与图标固定 14 / 16，三档看起来差别很小；现在高度、字号、图标同表联动（32/13/14、40/14/16、48/16/18），并对齐 uView-Pro 的三档思路
- **snake-input / snake-textarea:** 字号与高度改为 CSS 变量驱动，`size` / `height` / `fontSize` 优先级明确（档位 < 变量 < 属性）
- **snake-input:** 占位文字与输入文本没有垂直居中：H5 下 `uni-input` 被框架样式死定在 `1.4em`（14px 字号时 19.6px），内部文本盒只有 16px 且贴顶，在 40px 行里整体偏高 1.8px；现在原生控件按档位变量定高（`--snake-input-current-height`），实测占位符、标签、输入框三者中心线完全对齐
- **snake-form:** 新增 `disabled`，会下发到输入框、文本域、开关、滑块、单选组与复选组；输入框与文本域在禁用态下不再派发 `click`。表单项可用自身 `disabled` 覆盖
- **snake-form:** 新增 `validateTrigger`（`change` / `blur`，可传数组）：此前校验时机写死为「有匹配 trigger 规则就跑」，想只在提交或失焦校验只能改规则；被关掉的时机仍会清掉上一次留下的错误提示
- **snake-form:** `FormField` 协议此前是「发明」的（声明 `validate` / `reset` / `clear`，FormItem 实际注册的是 `validation` / `resetField`，中间靠 `as any` 抹平），现在契约与实际实现一致，`register` / `unregister` 不再需要类型断言
- **snake-form:** 注销字段改为按实例引用移除：原实现按 `prop` 过滤，两个同名字段（例如 `v-for` 里暂时重复的路径）会互相误删，删掉一个另一个也失去校验
- **snake-form-item:** 必填星号由「绝对定位 + `padding-top: 3px`」改为标签行内的 flex 项：原来星号挂在标签框外 8px，`labelAlign` 靠右、`labelPosition=top` 或标签很短时位置漂移且与文字基线不齐
- **snake-form-item:** 错误文案行高由「等于字号」改为 1.5 倍：12px 字号配 12px 行高会把中文的上下伸展裁掉，多行提示挤在一起
- **snake-form-item:** 标签字号与错误文案字号改由尺寸档位类名 + CSS 变量驱动（`--snake-form-label-font-size*` / `--snake-form-message-font-size*`），保留 `size` 传自定义数值时走内联字号的旧行为
- **snake-picker:** `mutil-column` 传一维数组会直接抛错：列数按条目个数计算（4 条数据就是 4 列），而列数据只有 1 列，取第 2 列时读到 `undefined` 再取下标即报错；现在一维数组按单列处理
- **snake-picker:** 滚动过程中点「确认」被静默丢弃（`if (moving.value) return`），用户只会觉得按钮失灵；现在先挂起，`pickend` 后自动补发确认
- **snake-picker:** `border` 属性从未参与渲染（工具栏分隔线恒定显示，关不掉）；现在真正控制分隔线显隐，默认值不变
- **snake-picker:** 移除从未派发过的 `click` 事件声明：文档写着「点击触发入口（兼容声明）」，但组件里没有任何 `emit('click')` 分支，监听它永远收不到回调
- **snake-picker:** 联动模式 `children` 若成环（例如父子互相引用）会让 `while` 无限下钻；现在限制最多 20 列
- **snake-picker:** 打开状态下 `list` / `mode` 变化不会刷新滚轮，仍停在旧列数据上；现在会重新初始化，数据异步到达也能正常显示
- **snake-picker:** 选中行上下边线的声明是无效 CSS（`border: rgba(...)` 缺宽度与样式），iOS 与 H5 都不显示；现在改到 picker-view 原生 `::before` / `::after` 的边框色上，由 `--snake-picker-indicator-border-color` 控制——中途用 inset 阴影画的版本会和原生伪元素边框在同一位置叠成双线
- **snake-picker:** 滚轮遮罩过重（`0.95 → 0.6` 白），紧贴选中框的一行被盖掉大半，实测「选项二」几乎看不清；现在改为「表面色 → 透明」的单层渐变，颜色跟随明暗主题，暗色模式下不再出现一层白雾
- **snake-picker:** 全局主题表里针对原生 picker-view 的遮罩 / 指示框规则带 `!important`，把组件自己的主题变量全部盖掉（`--snake-select-mask-rgb` 之类改了没反应），其中 `.snake-picker-view-indicator` 这条选择器还少写了一段前缀、声明里没有边框宽度，属于历史遗留的无效样式；现在这些样式归组件自己维护，全局表不再抢
- **snake-picker:** 工具栏两侧按钮被 `min-width: 75px` + `padding: 10px 15px` 撑到各 105px（390px 屏上占掉 270px），标题只剩很窄一段且 14px 看起来比选项还小；现在按钮靠 16px 内边距撑宽、44px 高垂直居中，字号 16px，标题 15px/600 用主文字色
- **snake-picker:** 选项文字贴边：cell 只有 4px 内边距，长文案几乎顶到屏幕边缘；现在左右各 12px，并把 `max-width` 补到省略号容器上，超长文案按单行省略显示
- **snake-form-item:** 命中触发时机但没有匹配规则时会留下过期红字：`validation(trigger)` 在规则过滤后为空时只回调空文案、不动 `validateState`，于是「提交时报错的字段，用 select / switch 确认后仍显示旧错误」；现在会先撤掉上一次的提示
- **snake-navbar:** 微信 / QQ 小程序右上角胶囊会压住右侧插槽：现在按 `getMenuButtonBoundingClientRect()` 让出胶囊宽度，标题的最大宽度同步扣掉这段，`#right` 里的操作不再被胶囊盖住（H5 / App 取 0，行为不变）
- **snake-navbar:** 底部分隔线由 1px 实线改为半像素（`::after` + `scaleY(0.5)`），高分屏上不再比小程序原生导航栏粗一倍；`backText` 默认跟随 `backIconColor`，此前会掉回全局文字色

### ⚙️ Changes | 变更

- **snake-skeleton（行为变更）:** 快速模式的 `titleHeight` 默认 `9 → 16`、`rowsHeight` 默认 `8 → 12`、`avatarSize` 默认 `16 → 32`；依赖旧默认值的页面会看到更厚实的占位块，要保留旧尺寸显式传 `:title-height="9"` / `:rows-height="8"` / `:avatar-size="16"` 即可
- **snake-skeleton:** 主题变量由 2 个增至 13 个：新增 6 个形态尺寸变量、2 个动画周期变量、3 个间距变量
- **snake-skeleton:** 内部注入契约 `SkeletonContext` 的 `animated` 换成 `animation`，类名 `snake-skeleton-item--animated` 拆为 `--animation-shimmer` / `--animation-pulse`；仅影响自己实现 provider 或覆盖该类名的宿主
- **version:** 版本号进入 `0.1.0`；本批新增的 9 个组件目录（6 个公开组件 + 3 个子项）API 冻结，后续只增不改
- **size:** 默认尺寸按 375 稿对齐 wot-ui / uView-Pro —— `snake-tag` 24px 高 / 12px 字号、`snake-collapse-item` 标题 15px 内容 14px、`snake-step` 标题 14px 描述 12px、`snake-grid-item` 文案 14px、`snake-swipe-action` 按钮 80px / 14px；`snake-action-sheet` 已落在两家区间内，未调整
- **snake-step:** 连接线由 `::after` 伪元素改为真实节点 + `v-if` 判末，不再依赖 `:last-child`（WXSS 选择器白名单里没有伪类，小程序端会漏画最后一段）；横向等分宽度从父级 scoped 后代选择器移到子项自身的 `flex: 1 1 0`，避免跨组件作用域失效后整排挤到左侧
- **snake-step:** `alignCenter` 补回真实语义并默认 `true`（横向本来就居中，此前该 prop 不生效）；关闭后圆点靠左、文字左对齐。标题与描述改用 `overflow-wrap: break-word`，订单号、运单号不再被逐字劈成两行；错误态标题跟随状态色；纵向最后一项去掉多余底部内边距；图标字号改由 `--snake-step-icon-size` 控制（默认 13px）
- **snake-swipe-action:** 同组互斥改为模块级登记表（`registry.ts`）：原实现把 `activeClose` 写在 `<script setup>` 里，编译后是 `setup()` 的局部变量、每实例私有，互斥从未生效，两项可以同时停在展开态；现在触摸开始与展开时都会收起其他项
- **snake-swipe-action:** 越界拖动重设手势原点，修复钳制后回拉出现整段死区（原实现在边界处停住，手指回拉要先走完越界距离画面才跟手）
- **snake-swipe-action:** 左右按钮区改为 `translate3d(±100%)` 挂到可视区外，不再压在内容底下；`--snake-swipe-action-bg` 默认值由白底改为 `transparent`，内容区透明也不会透出按钮
- **snake-swipe-action:** 插槽按钮宽度改为实测（`getRect`），props 推导值仅作兜底：原实现只用 `actions.length × buttonWidth` 当宽度，且 `handleTouchStart` 在 `actions` 为空时直接返回，只传 `#actions` 插槽时完全滑不动
- **snake-swipe-action:** `threshold` 钳制到按钮总宽，避免阈值大于总宽时永远打不开；停留状态与位移解耦，`open` / `close` 只在状态真正变化时派发
- **snake-search:** 新增 `#left` / `#right` 插槽：前者替换左侧搜索图标，后者挂在清除控件之后（扫码、语音等附加入口）；新增主题变量 `--snake-search-action-max-width`（右侧按钮展开上限，默认 200px）
- **snake-input:** 新增 `clearTrigger`（`always` / `focus`）、`showWordLimit`（右侧字数统计）、`error`（外部强制错误态）三个道具，补齐 wot-ui 的对应能力
- **snake-textarea:** 新增 `formatter` / `formatTrigger` / `trim` 与 `error`，格式化与去空格语义与 `snake-input` 对齐；新增 `clear` / `click` 事件
- **snake-input:** 新增 `height`（覆盖档位高度）、`placeholderClass`、`customInputClass` 三个道具；`snake-textarea` 新增 `placeholderClass`、`disableDefaultPadding`
- **libs:** 新增 `fieldSize.ts` 尺寸表，Input 与 Textarea 共用同一套高度/字号/图标数值，避免两个组件各写一份魔法数字继续漂移；两组件各补 6~11 个组件级主题变量（`--snake-input-*` / `--snake-textarea-*`）
- **snake-form:** 新增 `asteriskPosition`（`start` / `end`）与 `hideAsterisk`，与 `disabled`、`validateTrigger` 一样支持 Form 定默认值、FormItem 覆盖（空字符串表示继承），对齐 wot-ui 的表单级默认配置
- **snake-form-item:** 新增 14 个组件级主题变量（`--snake-form-item-padding`、`--snake-form-label-*`、`--snake-form-asterisk-color`、`--snake-form-border-color`、`--snake-form-message-*` 等），此前只能改全局色板或写 `customStyle`
- **snake-select → snake-picker:** 组件改名（不保留旧名）：它是基于 `picker-view` 的底部滚轮，没有触发入口、没有选中值，`v-model` 只控制弹层开合——叫 `select` 与业界语义（有输入框、有值的选择控件）和库内「`snake-` + 原生标签」的约定都不符，故统一为 `snake-picker`：`snake-select` 标签、`SelectProps` / `SelectEmits` / `SelectExpose` / `SelectItem` / `SelectResult` 等类型、`snake-select__*` 类名与 `--snake-select-*` 主题变量全部改为 `picker`，文档路径改为 `/components/picker`。`select` 名称腾出，留给后续真正带触发框的选择控件
- **snake-parse → snake-rich-text:** 组件改名（不保留旧名）：`parse` 描述的是「解析」这个动作，而组件交付的是渲染后的富文本；uni-app 原生叫 `rich-text`，wot-ui 用 `wd-rich-text`，uView-Pro 已删除 `u-parse`（文档标注「该组件已废弃」），只有 uView 2.x / uview-plus 还沿用 `up-parse`。标签改为 `snake-rich-text`，类型改为 `RichTextProps` / `RichTextEmits`，文档路径改为 `/components/rich-text`；15 个道具与 `up-parse` 同名，迁移只需换标签
- **snake-rich-text → snake-cms-rich-text:** 原 `snake-rich-text` 是 `snake-cms` 的富文本区块薄封装（`libs/cms/blocks.ts` 里 `richtext` 指向它），名字让给渲染组件后改为 `snake-cms-rich-text`，类型改为 `CmsRichTextProps`；CMS 数据里的 `richtext` 块 key 不变，线上装修数据不受影响
- **snake-checkbox-group / snake-radio-group:** 子项上下文新增合并后的 `disabled`，子项优先读它；即使 group 自身没写 `disabled`，Form 的禁用也能穿透到每个 checkbox / radio
- **snake-picker:** 新增 `itemHeight`（默认 44）与 `visibleItemCount`（默认 6）：弹层高度 = 行高 × 可见行数（默认 264px，此前固定 250px、行高由框架默认 34px 决定）；补齐 `change` 事件（滚动落定即派发）、`beforeConfirm` 异步拦截（必须显式放行）、`open` / `close` 方法、`rootPortal`、`disabled`、`emptyText`
- **snake-picker:** 无数据时渲染空态文案（此前是一块空白滚轮面板）；滑动中或等待拦截器时确认按钮置灰，拦截器等待期间不会误关弹层
- **snake-picker:** 新增 `round`（默认 `true`）：面板圆角交给 `snake-popup` 的 `round` 绘制，与其它底部弹层同一套参数，`false` 即直角、数字/字符串按 CSS 尺寸；组件不再自建 `--snake-picker-panel-radius`
- **snake-picker:** 视觉重做，对齐 wot-ui / uView-Pro：选中行改为「圆角浅色条 + 字重 600」，浅色条左右内缩 12px、圆角 6px、底色取 `--snake-color-background`（整块 `#f1f1f1` 通栏灰条会被当成禁用块）；浅色条画在组件自己的节点上并压在原生 picker-view 之下（直接给原生 indicator 加底色会盖住选中项文字，靠 z-index 压制在小程序端不可移植）；滚轮遮罩改为表面色 → 透明的渐变；工具栏 44px、标题 15px/600、操作按钮 16px；选中框上下 hairline 改为可选（给 `--snake-picker-indicator-border-color` 一个颜色才画）
- **snake-picker:** 组件级主题变量由 15 个增至 22 个：新增 `--snake-picker-roller-bg`、`--snake-picker-roller-inset-x`、`--snake-picker-roller-radius`、`--snake-picker-item-active-color`、`--snake-picker-item-active-font-weight`、`--snake-picker-mask-color`、`--snake-picker-title-font-weight`、`--snake-picker-toolbar-padding-x`、`--snake-picker-item-padding-x`，移除 `--snake-picker-panel-radius` 与 `--snake-picker-mask-rgb`
- **snake-picker:** 工具栏改为标题 `flex: 1` 居中、按钮定宽不换行，长标题不再挤压按钮
- **snake-picker:** 接入 `snake-form-item`：跟随表单项与整表的 `disabled`，确认成功后触发 `change` 校验（「选完即校验」）
- **locale:** 新增 `picker.emptyText`（`暂无数据` / `No data`）
- **snake-navbar:** 返回热区的按压反馈由「44×44 叠黑色块」改为前景变淡（`opacity: 0.55` + 150ms 过渡）：彩色导航栏上不再出现一块灰色方块，`hover-stay-time` 取 70ms，抬手即恢复
- **theme:** 主色上的前景统一为白字：`snake-button` / `snake-tag` 与 `snake-subsection` 的选中项取 `--snake-color-white`，`primaryInk` 默认白字 `#ffffff`（亮色与暗色板一致），示例导航栏因此与按钮、标签同色；需要更高对比的主题把 `primaryInk` 改成墨绿 `#073b2a`（品牌绿上 6.37:1，白字 1.98:1）即可
- **demo:** 示例应用导航栏不再硬编码品牌绿（原 `#007A55`，暗色 `#01513B`），改为「主题主色做底 + 白字做前景」，与按钮 / 标签的实心主色一致：切主题时整条跟着品牌色走，按压反馈叠黑，文档站手机预览壳的状态栏同步
- **docs:** 组件总览公开条目由 50 个增至 56 个，README 组件数量同步修正

### ✏️ Documentation | 文档

- **docs:** skeleton 文档重写：快速模式与逐行宽度、自定义模板（并说明为什么不做 `row-col` 声明式配置）、动画三档与性能差异、主题变量、无障碍、「与其他组件库的对照」以及常见问题（闪一下就消失 / 高度抖动 / 深色发白 / 动画不动 / 小程序卡顿 / NVUE 百分比）
- **demo:** 骨架屏示例页重做：快速模式、动画对比（三档动画各占一行，避免 320~420 宽下头像把正文挤成几像素）、自定义模板（商品卡片 / 图文列表）、跟随主题、占位形态、请求状态联动与参数面板；补齐中英文案，顺带修掉英文界面下标题回落成中文的问题
- **docs:** 新增 tag / action-sheet / steps / collapse / grid / swipe-action 文档页与总览注册，并补齐 `preview` 在线预览
- **demo:** 新增 6 个示例页（含 `DemoControlPanel` 参数面板与中英文案），覆盖标签主题与镂空、动作面板显隐与 `action-item` 单行自定义、步骤条方向/点状模式/异常状态/自定义图标、折叠面板图标插槽/动画时长、宫格列数/等高/间距、滑动操作阈值与同组互斥
- **docs:** steps 文档补充点状模式、对齐方式与新增主题变量（`--snake-step-dot-size` / `--snake-step-icon-size` / `--snake-step-status-color`），并把示例里不在字库中的图标名（`wallet` / `box` / `truck`）换成 `rmb` / `bag` / `car`
- **docs:** swipe-action 文档重写：左右双向、自定义按钮区、`v-model` 受控展开、`beforeClose` 关闭前拦截、同组互斥；API 表补齐 `leftActions` / `modelValue` / `beforeClose` / `contentClick` / `refresh` 与 `--snake-swipe-action-icon-size`，示例页新增插槽按钮、受控切换与确认弹窗
- **docs:** search 文档重写：形状与状态、插槽、右侧按钮定制、受控与方法调用，补 Slots / Expose / 主题变量表；示例页新增插槽、按钮定制与 `ref` 方法三组用例，去掉白底在白卡片上看不见的示例
- **docs:** input 文档补充「清除与字数」「只读与点击」「Expose」，示例页重排为实时配置、清除与字数、只读禁用与错误态、密码格式化与去空格、方法与插槽、表单联动六个区块，并加上事件回显
- **docs:** textarea 文档补充「字数与格式化」「只读与点击」「Expose」，示例页新增 emoji 字数、格式化、只读点击与 `ref` 方法四组用例
- **docs:** input / textarea 文档补「尺寸与主题」章节与尺寸档位表，主题变量拆成尺寸变量与颜色变量两组；示例页新增尺寸档位、`height` 覆盖与 CSS 变量主题化三组用例
- **docs:** form 文档补充「禁用」「校验时机」「必填星号」三章与 14 个主题变量表，示例页新增「禁用与主题」区块并接入禁用整表、校验时机、星号位置三个开关
- **docs:** picker 文档重写：行高与可见行数、样式、异步校验、空态、禁用、表单联动、Methods 与 22 个主题变量；示例页新增异步校验、方法调用与表单联动区块，并把行高 / 可见行数 / 面板圆角 / `rootPortal` / 空数据接入参数面板，补 `change` 实时回显与长文案省略示例
- **docs:** multi-theme / custom-style 把 `primaryInk` 说明为「整片主色上的前景色」（默认白字，可改墨绿提高对比），示例导航栏与按钮、标签一样用白字；navbar 文档补小程序胶囊避让与半像素底线说明
- **docs:** color 文档重做：色卡跟着站点明暗开关切换亮 / 暗两套取值，每个语义色展开「加深 / 禁用 / 浅色」并标出令牌后缀；`primaryInk` 单列一节，给出实时对比度读数（默认 `1.98:1`，覆写墨绿 `#073B2A` 后 `6.37:1`）并说明库内组件的反白前景仍读 `--snake-color-white`；补 `primary-deep` / `primary-deeper` 两档深色的用途，文本与界面补暗色取值，遮罩与阴影改为「令牌 / 亮色 / 暗色」三列表；新增「工具类与 SCSS 变量」「对比度与可读性」两节
- **demo:** 色彩示例页重做：品牌色补 `primaryInk` 前景示例与实时对比度读数，状态色按 `success` / `warning` / `error` / `info` 展开「基准 / 加深 / 禁用 / 浅色」四档（对齐 uView-Pro 的分组方式），文本与表面行显示 `--snake-color-*` 令牌名并支持点按复制色值；遮罩改为盖在模拟内容上、阴影改画在页面背景上，暗色下不再是一块看不见的方块
- **docs:** rich-text 文档随改名重写：标题改为「RichText 富文本」，新增「与原生 `rich-text` 的区别」对照表与「与 uView 的关系」迁移提示，补「装修区块」说明；示例页路由由 `pages/componentsB/parse` 改为 `richText`，原 CMS 富文本区块示例移到 `cmsRichText`
- **specs:** 新增 `specs/2026-11-13-batch1-component-apis.md`，记录第一批组件的 API 设计与四项已确认决策

- **docs:** rich-text 文档补「与其他组件库的对照」（uview-plus `up-parse` / uView-Pro `u-parse` / wot-ui `wd-rich-text` 的迁移映射）、「常见问题」（H5 子路径静态资源 404、表格宽度、内容样式不生效）与 5 个主题变量表；Events 补 `pause` / `fullscreenchange`，并说明解析类参数改动会重新解析
- **demo:** rich-text 示例页重做（分组对齐 wot-ui）：文章正文排版、三组表格（普通 / 宽表横向滚动 / 合并单元格）、图片预览与 `error-img` 兜底、音视频、链接与锚点跳转、空内容插槽、事件日志，以及 6 个参数开关；内容不再写死灰底与深色文字，改用 `tagStyle` + 主题变量，暗色模式下可直接阅读
- **docs:** 组件总览的 rich-text 条目补描述与关键词（含旧名 `parse`，搜索旧名仍可命中）

## [0.0.20](https://github.com/purenia-ai/snake-ui/compare/v0.0.19...v0.0.20)（2026-11-11）

### 🐛 Bug Fixes | Bug 修复

- **snake-button:** `customStyle` 指定背景色时追加 `snake-button--filled`，细边框置透明、边框区露出自身底色，消除自定义深色底上多出的一条异色描边（`hairLine` 的 `::after` 取 `currentColor`，会跟随 `customStyle.color` 变白）
- **plugins:** root 插件的 JSONC 注释剥离改为字符串感知扫描，`https://…` 这类字符串内容不再被当作注释截断，修复 `pages.json` 启动解析崩溃
- **types:** 新增 `global.d.ts` 声明全部组件的 `GlobalComponents` 类型增强，volar 3.x 编辑器不再把组件退化为 `any`

### ⚙️ Changes | 变更

- **types（行为变更）:** 入口类型收编为源码即声明：删除 `index.d.ts`，ambient 声明并入 `index.ts`；`package.json` 移除 `types` 字段，类型改由源码解析

### ✏️ Documentation | 文档

- **upload:** 示例页重写，覆盖校验拦截、手动上传与取消、自定义按钮与列表等场景，i18n 同步补齐英文词条

## [0.0.19](https://github.com/purenia-ai/snake-ui/compare/v0.0.18...v0.0.19)（2026-11-10）

### 🐛 Bug Fixes | Bug 修复

- **plugins:** 修复 `plugins` 编译产物把 `App.root.vue` 的注入路径误补成 `.vue.cjs` / `.vue.mjs` 的问题：扩展名只补齐「没有扩展名的相对导入」，并加构建断言防止复发

## [0.0.18](https://github.com/purenia-ai/snake-ui/compare/v0.0.17...v0.0.18)（2026-11-10）

### ✨ Features | 新功能

- **plugins:** `@puresnake/snake-ui/plugins` 提供 ESM / CJS 双入口：`plugins/index.mjs`、`plugins/index.cjs` 指向编译产物 `plugins/root/dist`，`package.json` 的 `exports` 按 `import` / `require` 条件分发，`types` 仍指向源码；`vite.config.ts` 可直接 `import { UniRoot } from '@puresnake/snake-ui/plugins'`，无需相对路径，也不再依赖 pnpm hoisted 布局

## [0.0.16](https://github.com/purenia-ai/snake-ui/compare/v0.0.15...v0.0.16)（2026-11-09）

### ✨ Features | 新功能

- **theme:** 主题支持自定义 CSS 变量：`Theme.css` / `Theme.darkCss` 随色板注入页面根部，暗色模式下合并生效（`darkCss` 只覆盖同名键，其余沿用 `css`）；`theme` 配置顶层 `css` / `darkCss` 可广播到全部主题，主题自身同名键优先

### 🐛 Bug Fixes | Bug 修复

- **theme（行为变更）:** 只改亮色的令牌按亮色色相与饱和度派生暗色、明度沿用基线，暗色下不再回落到内置颜色；`background`、`surface`、`text`、`border`、`divider`、`mask`、`shadow`、`primaryInk` 等结构性令牌仍使用基线暗色
- **theme（行为变更）:** `themes` 不再自动混入内置主题，声明的列表即最终列表；空数组回退内置主题；默认主题名不存在时回写 `config.defaultTheme`；`setThemeColor` 在亮色下同步派生暗色
- **theme:** 扁平单主题形态支持 `css` / `darkCss` / `name` / `darkColor`，`css`、`label` 等元信息不再被当作颜色令牌
- **snake-tabbar:** `isDot` 圆点角标补 8×8 尺寸修饰类，不再渲染成 18×2 的细线
- **snake-popup:** 关闭按钮默认尺寸由 10 调整为 16
- **snake-filter-sorts:** 筛选面板内边距左右对称，价格输入撑满列宽
- **docs:** 主题生成器导出片段改用库中真实导出（`defaultTheme`、`Theme`），修复产物无法编译

### ♻️ Documentation | 文档

- **多主题:** 新增「自定义 CSS 变量」章节（`css` / `darkCss` 合并语义、顶层共享变量、暗色推导与结构性令牌例外），修正主题持久化键名
- **tabbar:** 新增 Tabbar 示例页（凸起按钮、角标、禁用、激活色与高度调节），补概览条目与文档预览
- **示例页:** indexList / indexAnchor / indexListPanel / popup / form / badge / icon / button / loading / link / empty / text / transition / rootPortal 示例页 i18n 收口与结构重排，概览页补齐 verificationCode 条目

## [0.0.15](https://github.com/purenia-ai/snake-ui/compare/v0.0.14...v0.0.15)（2026-11-06）

### ✨ Features | 新功能

- **snake-icon:** `size` 默认值由 `inherit` 改为 `14`（px，375 稿）：默认带尺寸保底，父级字号较小时不再跟着缩小；显式传 `inherit` 仍可跟随父级字号
- **snake-empty:** 图标与图片尺寸分离：`iconSize` 明确为字体图标 em 字号（默认 80 → 96），新增 `imageSize` 控制插画/图片尺寸（默认 160），内边距与文案间距同步调整

### 🐛 Bug Fixes | Bug 修复

- **snake-drop-menu:** 架构重构，标题栏收归 `DropMenu` 统一渲染、菜单项只保留内容面板：共享 `snake-overlay` 遮罩（锁定背景滚动）、面板定位补 `--window-top`（修复 H5 导航栏偏移）、`menuIcon` 真正生效、`show` 语义改为是否在标题栏显示、修复动态增删菜单项后 `highlight`/`open` 下标错位、同屏多实例互斥、暴露方法去掉 `colseAll` 统一为 `close`
- **snake-sticky:** 常驻占位结构重构：测得高度后占位层定高、内容层常驻 absolute，吸顶切换不再引起布局跳动；测量对象改为内容层，H5 端用 ResizeObserver 监听内容尺寸
- **snake-filter-sorts:** 筛选标签固定每行 4 个（宽度改为百分比），新增 `nth-child(4n)` 规则去掉行尾右间距，四列左右对齐

### ✏️ Documentation | 文档

- `color.md` 色板的 `primary-light` 修正为 token 实际值 `#06D2901A`

## [0.0.14](https://github.com/purenia-ai/snake-ui/compare/v0.0.13...v0.0.14)（2026-11-06）

### 🐛 Bug Fixes | Bug 修复

- **snake-image:** 失败态改为灰底居中图标：默认 `errorIcon` 改用 `error-circle`，占位层补 `--snake-color-surface-muted` 底色，加载/失败统一 24px 图标且不再叠加默认文案（插槽仍可自定义）；`loading-img` / `error-img` 自身加载失败时回退内置图标，空 `src` 不再提示"加载失败"，仅懒加载时重置图片 key 避免挂载即重复请求
- **snake-sticky:** 吸顶判定重构：观察根顶边改为吸顶线加自身高度并按阈值 0 实时判定，修复吸顶块高于视口时永不触发；降级路径改用宿主 `scrollTop`（原 `onPageScroll` 注册在 H5 与小程序均不会回调），返回页恢复滚动与锚点跳转后也会即时校正

### ✏️ Documentation | 文档

- 示例页骨架统一：`.demo-variant-title` 基础样式收编至全局 demo.scss，去除 30 个示例页的重复定义；upload 示例迁移到 DemoSection / DemoControlPanel 统一骨架并补齐中英文案

## [0.0.13](https://github.com/purenia-ai/snake-ui/compare/v0.0.12...v0.0.13)（2026-11-05）

### ✨ Features | 新功能

- **snake-verification-code:** 新增验证码倒计时组件：无 UI 状态机，`seconds` / `startText` / `changeText` / `endText` 可配，支持跨页面续跑（`keepRunning` + `uniqueKey`），暴露 `start` / `reset` 方法与 `change` / `start` / `end` 事件，附中英文案与示例页

### 🐛 Bug Fixes | Bug 修复

- **snake-root-portal:** App 端节点清理钩子改用 `beforeUnmount`：`beforeDestroy` 在 Vue 3 视图层不会执行，组件卸载后传送节点不再残留
- **snake-calendar:** 修复星期文案语言判断：`currentLocale` 是对象而非字符串，中文环境此前一直显示裸“日/一/二”，现正确显示“星期日/星期一”
- **snake-search:** 输入与搜索事件参数类型放宽，消除与原生 `<input>` 事件签名的类型冲突（运行时行为不变）
- **snake-parse:** wxs 脚本块移至主脚本之后，避免 vue-tsc 将整个 SFC 误判为 TS 导致类型检查报大量语法错误
- **request:** 拦截器伪泛型与传输假联合修正，请求类型归位 request 模块

### ⚠️ Breaking Changes | 不兼容变更

- **snake-input:** 移除 `password` 属性，密码框改用 `type="password"`，保留单一入口
- **snake-notice-bar:** 移除 `direction` 属性，垂直模式改用 `mode="vertical"`，保留单一入口

### ✏️ Documentation | 文档

- 组件文档 API 表重构为一条一行：补齐缺失属性、事件与主题变量，修正默认值
- 新增 snake-verification-code 组件文档与示例页

## [0.0.12](https://github.com/purenia-ai/snake-ui/compare/v0.0.11...v0.0.12)（2026-11-04）

### ✨ Features | 新功能

- **snake-badge:** 新增徽标组件：包裹内容并在右上角圆心对准角点挂载数字 / 圆点徽标，支持 max 溢出、showZero、hidden 与 top/right 偏移，无插槽时作独立徽标
- **snake-tabs:** 新增 `click` / `disabled` 事件与标签项 `disabled` 字段（置灰并拦截切换）；徽标改由 snake-badge 渲染并锚定文字右上角点，`offset` 语义改为相对角点偏移且默认归零
- **snake-tabs:** 滑块与滚动改现场测量（前方宽度累加推算内容坐标），字体晚到、语言切换或动态换标后不再错位；同值 scroll-left 加微量扰动，回切标签也能回中

### 🐛 Bug Fixes | Bug 修复

- **snake-tabs:** 修复徽标上半截被 scroll-view 裁切：包裹层行高回归 normal 并垂直居中，角点留在滚动区内
- **snake-tabs:** 修复滑块加粗后抬升量随厚度翻倍顶到文字，底部改固定 3px 间隙
- **snake-tabs:** 修复纯 CSS 样式块内的非法行注释导致 PostCSS 构建失败

## [0.0.11](https://github.com/purenia-ai/snake-ui/compare/v0.0.10...v0.0.11)（2026-11-04）

### ✨ Features | 新功能

- **unitToPx:** 新增尺寸解析工具：裸数字按 375 稿 px、rpx 后缀按视口换算，供参与几何运算的属性使用
- **snake-sticky:** H5 端未传 `customNavHeight` 时自动让出 uni-app 内置导航栏 44px；显式传值（含 0）仍按传入值生效，其余端行为不变

### 🐛 Bug Fixes | Bug 修复

- **snake-tabs:** 滑块偏移与圆角改用 unitToPx 解析，`barWidth` / `barHeight` 传 `50rpx` 等带单位值时不再使滑块滞留最左侧
- **snake-circle-progress:** 画布尺寸同步解析单位值，修复 `width` 传 rpx 时按回退值 100 光栅化导致的压缩变形
- **snake-read-more:** `showHeight` 高度比较同样支持带单位值
- **snake-subsection:** 分段模式末项分隔线改由内联样式控制，`:not()` 不可靠的小程序端不再残留

## [0.0.10](https://github.com/purenia-ai/snake-ui/compare/v0.0.9...v0.0.10)（2026-11-04）

### ✨ Features | 新功能

- **snake-circle-progress:** 新增环形进度条：canvas 绘制、中心透明、圆头弧端，微信端按像素比高清渲染
- **v2.floatbutton:** 复用悬浮气泡：可关闭（按组件 id 记忆）、滚动半藏家族签名、跳转走 link service
- **snake-floating-bubble:** 新增 `unit` 尺寸口径与 `hide-on-scroll` 开关属性
- **snake-link:** 小程序端新增 `copy-success` / `copy-fail` 事件
- **snake-search:** 新增 `type` 属性，支持数字 / 身份证 / 小数点键盘

### 🐛 Bug Fixes | Bug 修复

- **snake-floating-bubble:** 收起改为纯 CSS 位移并补偿右边距，修复偶发反向飞出与露幅超半
- **v2.floatbutton:** 修复 `position.bottom` 为 0 时被默认值吞掉
- **snake-drop-menu:** 标题栏默认高度 20→40（迁移折半遗留）
- **snake-line-progress:** `percent` 钳制 0-100 并容错非法输入，百分比文字取整

### ✏️ Documentation | 文档

- 文档与注释全量改用中性表述，移除第三方库对照审计页与对应守卫
- 修正 floatbutton / drop-menu / line-progress 文档默认值漂移

## [0.0.9](https://github.com/purenia-ai/snake-ui/compare/v0.0.7...v0.0.9)（2026-11-03）

### ✨ Features | 新功能

- **from375:** 新增 `uni.$snake.from375`，旧 px 语义字段随屏等比渲染
- **snake-filter-sorts:** 新增 `fontSize` / `titleSize` 属性
- **snake-button-sort:** 新增 `fontSize` 属性

### 🐛 Bug Fixes | Bug 修复

- **from750:** 输出改回 rpx，v1 CMS 区块在宽屏机型恢复随屏等比（375 机型无变化）
- **magiccube / pictureads:** 盒子与图片高度同步等比，宽屏不再溢出裁切
- **pictureads:** 修复轮播分支高度 ×2 与圆角口径，App 端与编辑器 v1 预览一致
- **snake-cms:** 商品区 chrome（tabs / 筛选栏 / 加载更多 / 空态 / 回到顶部）恢复随屏等比
- **runtime:** 修复 H5 本地开发下商品服务对组件不可见（预打包入口与 easycom 组件各持一份模块状态）
- **snake-text:** `size` 默认 28→14
- **snake-skeleton:** `titleHeight` 18→9、`rowsHeight` 16→8、`avatarSize` 32→16
- **snake-upload:** `width` / `height` 默认 200→100
- **snake-tooltip:** `offset` 默认 8→4
- **snake-empty:** `iconSize` 60→80、`fontSize` 13→14，空状态更醒目
- **snake-loading:** `textSize` 默认 7→12，恢复可读

## [0.0.7](https://github.com/purenia-ai/snake-ui/compare/v0.0.6...v0.0.7)（2026-11-02）

### 🐛 Bug Fixes | Bug 修复

- **magiccube:** 修复 `pageMargin` / `imgMargin` 静默失效（模板裸调用未注册的 `from750`，统一走 `$snake.from750`）

## [0.0.6](https://github.com/purenia-ai/snake-ui/compare/v0.0.5...v0.0.6)（2026-11-02）

### ⚙️ Changes | 变更

- **单位体系:** 全库 rpx（750 稿）迁移为 px（375 稿）：裸数字属性按 px 解释、尺寸默认值减半、`1rpx` 细线改 `1px`、`addUnit` 默认单位改 px
- **宿主迁移:** 传给组件的裸数字属性 ÷2 即可；带 `rpx` 字符串的属性与宿主页面自有样式不受影响
- **from750:** 新增 `uni.$snake.from750`，承接 CMS v1 存量 750 稿数据，旧数据零迁移
- **v2 组件:** 尺寸契约改为 375 稿原生 px，渲染助手 `rpx()` 更名 `px()`（编辑器 schema 同步）
- **pxToRpx:** 标记 deprecated

### 🐛 Bug Fixes | Bug 修复

- **snake-cms:** 修复视频块从不渲染（编辑器存量 key `videoss` 与分发端 `videos` 不一致，现两者兼容）
- **magiccube:** 修复第 5 种布局高度语义与主路径不一致

### ✏️ Documentation | 文档

- 文档全量对齐 px 口径（属性表 / 示例 / CMS 数据契约）

## [0.0.5](https://github.com/purenia-ai/snake-ui/compare/v0.0.4...v0.0.5)（2026-10-30）

### 🐛 Bug Fixes | Bug 修复

- **$snake 类型:** 改为可增强的 `SnakeGlobalAPI` 接口，宿主补充成员不再与包内声明冲突

## [0.0.4](https://github.com/purenia-ai/snake-ui/compare/v0.0.3...v0.0.4)（2026-10-30）

### ✨ Features | 新功能

- **qrcode:** 新增子路径 `@puresnake/snake-ui/qrcode`，导出 `generateQRCode` / `QRErrorCorrectLevel`，海报合成可直接取矩阵
- **snake-index-list:** 窗口尺寸变化自动重测锚点；开发期 `indexList` 与锚点不匹配时输出告警
- **snake-button:** 新增 `icon`（内置图标，随文字配色）与 `block`（占满整行）属性
- **snake-calendar:** 内置节日新增春节、元宵、端午、中秋、重阳（农历换算）与清明（节气）
- **snake-popup:** 新增 `root-portal` 属性，弹层脱离祖先 transform / overflow 裁剪；补齐 `before-enter` 等四个动画事件透传

### 🐛 Bug Fixes | Bug 修复

- **snake-skeleton:** 占位色适配暗色模式（主题变量此前未定义，长期落在浅灰 fallback）
- **snake-calendar:** 修复 `is-page` 内嵌模式整体不渲染
- **snake-calendar:** 修复「今天」标记被 `minDate` / `maxDate` 钳制错位
- **snake-calendar:** `change` 事件 `week` 改为随语言返回
- **snake-button:** 修复 `type="info"` 无样式、禁用态文字不可见、plain 禁用不可区分等多个状态死角
- **exports:** 补充 `./components/snake-cms/types` 显式入口，修复 TS bundler 解析报 TS2307

### ⚙️ Changes | 变更

- **snake-calendar:** 移除双十一内置节日；底部确定按钮占满整行
- **snake-button:** 加载态改用内置 `snake-loading` 指示器，颜色继承文字色
- **主题:** `--snake-color-primary-light` 修正为主色 10% 透明度，相关 fallback 同步
- **仓库:** 迁移至 GitHub 组织 [purenia-ai/snake-ui](https://github.com/purenia-ai/snake-ui)，补 MIT LICENSE 与文档站入口

### ✏️ Documentation | 文档

- 更新日志改为 Keep a Changelog 结构；二维码演示页收敛为卡片布局

## [0.0.3](https://github.com/purenia-ai/snake-ui/compare/v0.0.2...v0.0.3)（2026-10-29）

### 🐛 Bug Fixes | Bug 修复

- **exports:** `./libs/request`、`./libs/runtime` 等深层路径提供显式入口，修复 TS / Vite 无法解析

### ✏️ Documentation | 文档

- 新增 `pnpm changelog:sync`，文档站更新日志随发版自动对齐

## [0.0.2](https://github.com/purenia-ai/snake-ui/compare/v0.0.1...v0.0.2)（2026-10-29）

### ✨ Features | 新功能

- **exports:** 补齐 `./libs/*` 等子路径，可直接按路径 import

> 注：0.0.1 – 0.0.3 发布自同一份工作区快照（npm registry 记录的 gitHead 均为 afb1b62），版本间差异只存在于 npm 包内容，git 比对在此期间为空；自 0.0.3 起改动随提交入库。

## 0.0.1（2026-10-29）

### ✨ Features | 新功能

- 首个 npm 公开发布版本（MIT）。基于 Vue 3 + TypeScript 的 uni-app 组件库，面向商城与 CMS 场景
- 46 个通用组件 + 14 个配置驱动的 CMS 页面区块（`snake-cms` 统一渲染）
- 内置明暗主题、中英文多语言、HTTP 客户端与常用 hooks / 工具
- 兼容 H5、微信 / 支付宝小程序、App 等多端
