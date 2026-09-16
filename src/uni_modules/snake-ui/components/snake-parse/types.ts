/** snake-parse's public cross-platform rich-content contract. */
export interface ParseProps {
    content?: string;
    containerStyle?: string;
    domain?: string;
    tagStyle?: Record<string, string>;
    lazyLoad?: boolean;
    loadingImg?: string;
    errorImg?: string;
    previewImg?: boolean;
    showImgMenu?: boolean;
    copyLink?: boolean;
    pauseVideo?: boolean;
    scrollTable?: boolean;
    selectable?: boolean;
    setTitle?: boolean;
    useAnchor?: boolean | number;
}

export interface ParseEmits {
    load: [];
    ready: [rect: UniApp.NodeInfo | Record<string, never>];
    imgtap: [attrs: Record<string, string> | undefined];
    linktap: [attrs: Record<string, string>];
    play: [payload: { source: string; attrs: Record<string, string> | undefined }];
    error: [payload: { source: string; attrs: Record<string, string> | undefined }];
}
