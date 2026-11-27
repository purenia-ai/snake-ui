/** CmsRichText 装修区块的公开属性。 */
export interface CmsRichTextProps<Data extends Record<string, any> = Record<string, any>> {
    /** v2 富文本的 HTML 内容。 */
    content?: string;
    /** v1 富文本的装修数据，HTML 位于 `myValue`。 */
    datas?: Data;
    /** 区块背景色，未传时跟随页面背景。 */
    backgroundColor?: string;
}
