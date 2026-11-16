/**
 * @fileoverview 富文本示例内容
 *
 * 内容里不写死颜色：排版交给页面的 `tagStyle` 与 `--snake-rich-text-*` 变量，
 * 这样同一段内容在暗色主题下也能正常阅读。
 */

/** 文章正文：标题、段落、引用、强调与列表。 */
export const articleContent = `
<h2>山野手记 · 轻装出发</h2>
<p>把周末留给山野，把时间还给自己。这一期我们整理了轻量出行的必备清单，顺便聊聊为什么<strong>少带一点</strong>反而走得更远。</p>
<blockquote>行李越轻，路就越长。</blockquote>
<h3>出发前，装好这三样</h3>
<ul>
  <li>能走一天的<em>轻便鞋</em>，抓地力比外观更重要；</li>
  <li>一壶水和两份轻食，沿途补给点不一定开门；</li>
  <li>一个能装下垃圾的袋子，把走过的路复原。</li>
</ul>
<p>装备不必求全，<del>多带一件</del>常常意味着多背一路，<i>按天气和路线取舍</i>就好。</p>
`;

/** 普通表格：演示单元格边框、表头与斑马纹。 */
export const tableContent = `
<table>
  <thead>
    <tr><th>天数</th><th>时间</th><th>安排</th></tr>
  </thead>
  <tbody>
    <tr><td>第一天</td><td>09:00</td><td>湖畔集合，沿湖慢走</td></tr>
    <tr><td>第一天</td><td>14:00</td><td>林间扎营，手冲咖啡</td></tr>
    <tr><td>第二天</td><td>07:30</td><td>看完日出，收营返回</td></tr>
  </tbody>
</table>
`;

/** 宽表格：列宽合计超过容器，配合 `scroll-table` 独立横向滚动。 */
export const wideTableContent = `
<table style="width:640px">
  <thead>
    <tr><th>日期</th><th>出发</th><th>抵达</th><th>里程</th><th>爬升</th><th>难度</th></tr>
  </thead>
  <tbody>
    <tr><td>10-12</td><td>07:00</td><td>11:30</td><td>12 km</td><td>420 m</td><td>轻松</td></tr>
    <tr><td>10-13</td><td>06:30</td><td>13:10</td><td>18 km</td><td>760 m</td><td>进阶</td></tr>
    <tr><td>10-14</td><td>08:00</td><td>10:20</td><td>6 km</td><td>180 m</td><td>轻松</td></tr>
  </tbody>
</table>
`;

/** 合并单元格：`rowspan` 与 `colspan`。 */
export const mergedTableContent = `
<table>
  <thead>
    <tr><th>日期</th><th colspan="2">同行安排</th></tr>
  </thead>
  <tbody>
    <tr><td rowspan="2">周六</td><td>上午</td><td>山脚市集</td></tr>
    <tr><td>下午</td><td>湖边扎营</td></tr>
    <tr><td>周日</td><td colspan="2">日出后返程</td></tr>
  </tbody>
</table>
`;

/** 图片：宽度自适应容器，轻触即可预览。 */
export const imageContent = `
<p><img src="/static/demo-cms-p-bag.png" style="width:100%" alt="轻装包"></p>
<p style="font-size:12px;text-align:center">轻装包 24L，可折叠收纳，轻触查看大图</p>
`;

/** 加载失败的图片：用 `error-img` 兜底。 */
export const brokenImageContent = `
<p style="text-align:center"><img src="/static/not-found.png" style="width:96px" alt="图片加载失败"></p>
<p style="font-size:12px;text-align:center">上面的图片地址不存在，显示 error-img 占位图</p>
`;

/** 链接与锚点：站内锚点、站外链接。 */
export const linkContent = `
<p>点击下面的锚点会在当前页面内定位，站外链接默认交给组件的复制 / 打开策略处理。</p>
<p><a href="#rich-text-gear">跳到「出发清单」</a></p>
<p><a href="https://example.com/summer-route">站外链接 · 点击触发 linktap</a></p>
<h3 id="rich-text-gear">出发清单</h3>
<ul>
  <li>轻便鞋、速干衣、薄外套；</li>
  <li>水壶、轻食、垃圾袋；</li>
  <li>头灯、创可贴、充电宝。</li>
</ul>
`;

/** 媒体：随包分发的示例视频。 */
export const mediaContent = `
<video src="/static/demo-flower.mp4" controls style="width:100%;border-radius:8px"></video>
<p style="font-size:12px;text-align:center">视频由组件自带的播放器接管，播放新视频时会暂停其他视频</p>
`;

/** 空内容与插槽：`content` 为空时显示默认插槽。 */
export const noticeContent = `
<p><strong>本周活动预告</strong></p>
<p>周六上午十点，山脚市集见。带上旧书来换一束花。</p>
`;
