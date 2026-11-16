import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/components');

const read = (component, file) => readFile(resolve(root, component, file), 'utf8');

test('snake-tag 契约：默认实心态、镂空走半像素、关闭独立派发', async () => {
    const types = await read('snake-tag', 'types.ts');
    const source = await read('snake-tag', 'snake-tag.vue');

    assert.match(types, /export const tagProps =/);
    assert.match(types, /hairLine: \{ type: Boolean, default: true \}/);
    assert.match(types, /plain: \{ type: Boolean, default: false \}/);
    assert.match(types, /closable: \{ type: Boolean, default: false \}/);
    assert.match(source, /defineProps\(tagProps\)/);
    assert.match(source, /emit\('close'\)/);
    // 默认尺寸对齐 wot-ui 的 24px / 12px，避免比同类库偏小
    assert.match(source, /height: var\(--snake-tag-height, 24px\)/);
    assert.match(source, /font-size: var\(--snake-tag-font-size, 12px\)/);
    // 文字区 overflow: hidden 配合 line-height: 1 会裁掉西文下伸部
    assert.match(source, /line-height: 1\.2/);
    // 关闭图标必须由原生 view 承载：@click.stop 落在自定义组件事件上时，
    // 小程序 tap 事件对象没有 stopPropagation，close 可能不派发
    assert.match(source, /<view v-if="closable" class="snake-tag__close" @click\.stop="onClose">/);
    assert.match(source, /snake-tag__close::after/);
    // customStyle 指定背景色时描边取透明，复刻 snake-button 的修法
    assert.match(source, /const hasCustomBackground = computed/);
    assert.match(source, /'snake-tag--filled': hasCustomBackground/);
    // 镂空半像素描边：伪元素缩放 50%，与 snake-button 的既有修法一致
    assert.match(source, /snake-tag--hairline::after/);
    assert.match(source, /transform:\s*scale\(0\.5\)/);
    // 左侧图标可被插槽覆盖
    assert.match(source, /<slot name="icon">/);
    // WXSS 不支持通配选择器
    assert.doesNotMatch(source, />\s*\*/);
});

test('snake-action-sheet 契约：动作为数组且禁用/加载不派发 select', async () => {
    const types = await read('snake-action-sheet', 'types.ts');
    const source = await read('snake-action-sheet', 'snake-action-sheet.vue');

    assert.match(types, /export interface ActionSheetAction/);
    assert.match(types, /select: \[action: ActionSheetAction, index: number\]/);
    assert.match(source, /if \(action\.disabled \|\| action\.loading\) return;/);
    assert.match(source, /closeOnClickAction/);
    // 单行内容插槽：行容器与点击/关闭逻辑仍由组件负责，只替换行内部结构
    assert.match(source, /<slot name="action-item" :action="action" :index="index">/);
    // 加载态必须真的渲染转圈，而不是只把整行置灰
    assert.match(source, /snake-loading/);
    assert.doesNotMatch(source, /item--disabled': action\.disabled \|\| action\.loading/);
    // 显隐完全交给 snake-popup，自己不再实现遮罩与滚动锁定
    assert.match(source, /snake-popup/);
    assert.doesNotMatch(source, /uni\.hideTabBar/);
    assert.doesNotMatch(source, />\s*\*/);
});

test('snake-steps 契约：状态由父级 current 推导，连接线由真实节点绘制', async () => {
    const stepsTypes = await read('snake-steps', 'types.ts');
    const stepsSource = await read('snake-steps', 'snake-steps.vue');
    const stepSource = await read('snake-step', 'snake-step.vue');

    assert.match(stepsTypes, /export const stepsProps =/);
    assert.match(stepsTypes, /export const stepsContextKey/);
    assert.match(stepsSource, /linkChildren\(/);
    assert.match(stepsSource, /useChildren<ComponentPublicInstance, StepsContext>/);
    assert.match(stepSource, /useParent<StepsContext>/);
    // 状态推导：小于 current 为 finish，等于为 process，其余 wait
    assert.match(stepSource, /index\.value < current\) return 'finish'/);
    assert.match(stepSource, /index\.value === current\) return 'process'/);
    // 连接线用真实节点而非伪元素：WXSS 选择器白名单没有伪类，最后一段会漏画
    assert.match(stepSource, /<view v-if="showLine" class="snake-step__line" \/>/);
    assert.match(stepSource, /index\.value >= context\.children\.length - 1/);
    assert.doesNotMatch(stepSource, /snake-step__head::after/);
    assert.doesNotMatch(stepSource, /:last-child/);
    // 横向连线只画两指示器之间，避免透明圆点透出连线
    assert.match(stepSource, /left: calc\(50% \+ var\(--snake-step-indicator-size\) \/ 2\)/);
    // 等分宽度写在子项自身：父级 scoped 后代选择器跨组件在小程序端不可靠
    assert.match(stepSource, /flex: 1 1 0/);
    assert.doesNotMatch(stepsSource, /\.snake-steps--horizontal \.snake-step/);
    // 已完成画对勾、异常画叉，显式 icon 优先
    assert.match(stepSource, /if \(status\.value === 'finish'\) return 'checkmark'/);
    assert.match(stepSource, /if \(status\.value === 'error'\) return 'close'/);
    // 点状模式
    assert.match(stepsTypes, /dot: \{ type: Boolean, default: false \}/);
    assert.match(stepSource, /class="snake-step__dot"/);
    assert.match(stepSource, /--snake-step-indicator-size: var\(--snake-step-dot-size, 8px\)/);
    // alignCenter 默认为真：横向本身就是居中，关掉才是左对齐
    assert.match(stepsTypes, /alignCenter: \{ type: Boolean, default: true \}/);
    // 单号、链接不按字符截断
    assert.match(stepSource, /overflow-wrap: break-word/);
    assert.doesNotMatch(stepSource, /word-break: break-all/);
    // 错误态标题跟随状态色
    assert.match(stepSource, /\.snake-step--error \.snake-step__title/);
    // 标题/描述字号对齐 wot-ui（14 / 12）
    assert.match(stepSource, /font-size: var\(--snake-step-title-size, 14px\)/);
    assert.match(stepSource, /font-size: var\(--snake-step-description-size, 12px\)/);
    assert.doesNotMatch(stepSource, /createSelectorQuery/);
    assert.doesNotMatch(stepSource, />\s*\*/);
});

test('snake-collapse 契约：单值与数组统一归一化，手风琴只保留一项', async () => {
    const collapseSource = await read('snake-collapse', 'snake-collapse.vue');
    const itemSource = await read('snake-collapse-item', 'snake-collapse-item.vue');

    assert.match(collapseSource, /function normalizeValue\(value: CollapseValue\): \(string \| number\)\[\]/);
    assert.match(collapseSource, /next = current\.includes\(name\) \? '' : name;/);
    assert.match(collapseSource, /linkChildren\(\{/);
    assert.match(itemSource, /useParent<CollapseContext>/);
    // 展开高度用 max-height 过渡，不逐帧测量
    assert.match(itemSource, /maxHeight:/);
    // 标题左侧图标可被插槽覆盖
    assert.match(itemSource, /<slot name="icon">/);
    // 标题 / 内容字号对齐 wot-ui 与 uView-Pro（15 / 14）
    assert.match(itemSource, /font-size: var\(--snake-collapse-font-size, 15px\)/);
    assert.match(itemSource, /font-size: 14px;/);
    assert.doesNotMatch(itemSource, /createSelectorQuery/);
    assert.doesNotMatch(itemSource, />\s*\*/);
});

test('snake-grid 契约：宽度按列等分，外框与内线分别绘制', async () => {
    const gridSource = await read('snake-grid', 'snake-grid.vue');
    const itemSource = await read('snake-grid-item', 'snake-grid-item.vue');

    assert.match(gridSource, /snake-grid--bordered/);
    assert.match(gridSource, /linkChildren\(\{/);
    assert.match(itemSource, /width: `\$\{100 \/ column\.value\}%`/);
    assert.match(itemSource, /border-right: 1px solid/);
    // 等高靠 padding-top 撑出正方形，内容绝对定位
    assert.match(itemSource, /snake-grid-item--square::before/);
    assert.match(itemSource, /padding-top: 100%/);
    // 子项内容留白 = gutter/2 + --snake-grid-item-padding（给角标溢出与圆角裁剪留缓冲）
    assert.match(itemSource, /calc\(\$\{gutter > 0 \? gutter \/ 2 : 0\}px \+ var\(--snake-grid-item-padding, 0px\)\)/);
    assert.match(itemSource, /emit\('click', Math\.max\(0, index\.value\), event\)/);
    // 点击态走 hover-class：WXSS 不支持 :active 伪类
    assert.match(itemSource, /:hover-class="clickable && !disabled \? 'snake-grid-item--hover' : 'none'"/);
    assert.doesNotMatch(itemSource, /--clickable:active/);
    // 文案字号对齐 uView-Pro 的 14px（原来 12px 偏小）
    assert.match(itemSource, /font-size: var\(--snake-grid-text-size, 14px\)/);
    assert.doesNotMatch(itemSource, />\s*\*/);
});

test('snake-swipe-action 契约：越界重锚、同组互斥走模块登记、插槽按钮实测宽度', async () => {
    const source = await read('snake-swipe-action', 'snake-swipe-action.vue');
    const types = await read('snake-swipe-action', 'types.ts');
    const registry = await readFile(
        resolve(root, 'snake-swipe-action/registry.ts'),
        'utf8'
    );
    const touch = await readFile(
        resolve(import.meta.dirname, '../src/uni_modules/snake-ui/libs/hooks/useTouch.ts'),
        'utf8'
    );

    // 按钮宽度向 uView-Pro 的 90px 靠拢但更克制；字号对齐 14px
    assert.match(types, /buttonWidth: \{ type: Number, default: 80 \}/);
    assert.match(source, /font-size: var\(--snake-swipe-action-font-size, 14px\)/);
    // 纵向手势判定后不再接管，交给页面滚动
    assert.match(touch, /state\.direction = horizontal >= vertical \? 'horizontal' : 'vertical'/);
    assert.match(source, /if \(state\.direction !== 'horizontal'\) return;/);
    // 不能靠模板修饰符一刀切阻止默认行为，否则纵向滚动被吞掉
    assert.doesNotMatch(source, /@touchmove\.stop\.prevent/);
    assert.match(source, /typeof source\.preventDefault === 'function'/);

    // 左右双向：正位移露出左侧、负位移露出右侧，都钳制在各自按钮区宽度内
    assert.match(source, /const clamped = Math\.min\(leftWidth\.value, Math\.max\(-rightWidth\.value, raw\)\)/);
    // 越界后重设手势原点：原实现钳制后不重锚，手指拖出边界再回拉会有整段死区
    assert.match(source, /if \(clamped !== raw\) startOffset = clamped - state\.deltaX;/);

    // 同组互斥必须跨实例：原实现把 activeClose 写在 <script setup> 里，
    // 编译后是 setup() 局部变量，互斥永远不成立，两项能同时停开
    assert.doesNotMatch(source, /let activeClose/);
    assert.match(source, /if \(props\.autoClose\) closeOtherOpened\(collapse\);/);
    assert.match(source, /registerOpened\(collapse\);/);
    assert.match(source, /unregisterOpened\(collapse\);/);
    assert.match(registry, /const openedCollapsers = new Set<\(\) => void>\(\)/);
    assert.match(registry, /for \(const other of \[\.\.\.openedCollapsers\]\)/);

    // 操作区移出可视区：不再压在内容底下，内容区无需不透明背景
    assert.match(source, /transform: translate3d\(-100%, 0, 0\)/);
    assert.match(source, /transform: translate3d\(100%, 0, 0\)/);
    assert.match(source, /background-color: var\(--snake-swipe-action-bg, transparent\)/);
    assert.doesNotMatch(source, /snake-swipe-action__actions/);

    // 插槽自定义按钮宽度只能实测，props 推导值仅作兜底
    assert.match(source, /getRect\('\.snake-swipe-action__side--left', instance\)/);
    assert.match(source, /getRect\('\.snake-swipe-action__side--right', instance\)/);
    assert.match(source, /const rightWidth = computed\(\(\) => measuredRight\.value \|\| actionsWidth\.value\)/);

    // 阈值要钳制到按钮总宽，否则 threshold 大于总宽时永远打不开
    assert.match(source, /const limit = Math\.min\(props\.threshold > 0 \? props\.threshold : width \/ 2, width\)/);

    // 受控状态与关闭前拦截
    assert.match(types, /modelValue: \{[\s\S]{0,80}default: 'close'/);
    assert.match(types, /'update:modelValue': \[value: SwipeActionStatus\]/);
    assert.match(source, /await hook\(reason, position\)\) === true/);
    // 左侧按钮：props 与同名插槽都要有
    assert.match(types, /leftActions: \{/);
    assert.match(source, /<slot name="left" :close="closeSide">/);
    assert.doesNotMatch(source, />\s*\*/);
});
