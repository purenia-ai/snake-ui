/** snake-rich-text's public cross-platform rich-content contract. */
export interface RichTextProps {
    /** 要渲染的 HTML 内容。 */
    content?: string;
    /** 根容器样式。 */
    containerStyle?: string;
    /** 相对资源地址使用的主域名。 */
    domain?: string;
    /** 标签样式映射。 */
    tagStyle?: Record<string, string>;
    /** 是否延迟加载图片。 */
    lazyLoad?: boolean;
    /** 图片加载中的占位图。 */
    loadingImg?: string;
    /** 图片加载失败的占位图。 */
    errorImg?: string;
    /** 点击图片时是否打开预览。 */
    previewImg?: boolean;
    /** 是否显示图片长按菜单。 */
    showImgMenu?: boolean;
    /** 点击外部链接时是否复制地址。 */
    copyLink?: boolean;
    /** 播放新视频时是否暂停其他视频。 */
    pauseVideo?: boolean;
    /** 是否让表格独立横向滚动。 */
    scrollTable?: boolean;
    /** 文本是否可长按选择。 */
    selectable?: boolean;
    /** 是否使用 HTML 标题更新页面标题。 */
    setTitle?: boolean;
    /** 是否启用锚点定位，可指定偏移量。 */
    useAnchor?: boolean | number;
}

/** 音视频事件携带的内容来源与原始属性。 */
export interface RichTextMediaEvent {
    /** 媒体标签名：`video` 或 `audio`。 */
    source: string;
    /** 媒体标签的原始属性，`src` 为当前实际使用的地址。 */
    attrs: Record<string, string> | undefined;
    /** 平台事件 detail 透传，例如 `fullscreenchange` 的 `fullScreen`、`direction`。 */
    [key: string]: unknown;
}

/** 富文本加载、点击和媒体事件。 */
export interface RichTextEmits {
    /** 内容开始加载。 */
    load: [];
    /** 内容布局完成。 */
    ready: [rect: UniApp.NodeInfo | Record<string, never>];
    /** 用户点击图片。 */
    imgtap: [attrs: Record<string, string> | undefined];
    /** 用户点击链接。 */
    linktap: [attrs: Record<string, string>];
    /** 媒体开始播放。 */
    play: [payload: RichTextMediaEvent];
    /** 媒体暂停。 */
    pause: [payload: RichTextMediaEvent];
    /** 视频全屏状态变化。 */
    fullscreenchange: [payload: RichTextMediaEvent];
    /** 富文本资源加载失败。 */
    error: [payload: { source: string; attrs: Record<string, string> | undefined }];
}
