import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';

/** 可选择的文件类别。 */
export type SnakeUploadAcceptType = 'image' | 'video' | 'file' | 'media' | 'all';
/** 标准化后的文件类别。 */
export type SnakeUploadFileType = 'image' | 'video' | 'file';
/** 文件在上传队列中的状态。 */
export type SnakeUploadStatus = 'ready' | 'uploading' | 'success' | 'failed';

/** Snake Upload 使用的文件记录。 */
export interface SnakeUploadFileItem extends Record<string, unknown> {
    /** 预览或上传完成后的 URL。 */
    url?: string;
    /** 本地临时文件路径。 */
    path?: string;
    /** 文件名。 */
    name?: string;
    /** 文件字节数。 */
    size?: number;
    /** 标准化文件类别。 */
    fileType?: SnakeUploadFileType;
    /** 队列状态。 */
    status?: SnakeUploadStatus;
    /** 0 到 100 的上传进度。 */
    progress?: number;
    /** 是否上传失败。 */
    error?: boolean;
    /** 状态或错误提示。 */
    message?: string;
    /** 上传服务返回值。 */
    response?: unknown;
    /** 文件选择器返回的原始文件。 */
    file?: unknown;
    /** 视频等文件的缩略图。 */
    thumb?: string;
    /** 默认上传模式创建的 uni-app 上传任务。 */
    uploadTask?: UniApp.UploadTask;
}

/** 自定义上传适配器的运行上下文。 */
export interface SnakeUploadRequestContext {
    /** 当前文件索引。 */
    index: number;
    /** 当前文件列表快照。 */
    files: readonly SnakeUploadFileItem[];
    /** 表单文件字段名。 */
    name: string;
    /** 备用上传地址。 */
    action: string;
    /** 调用方配置的请求头。 */
    header: Record<string, unknown>;
    /** 调用方配置的附加表单数据。 */
    formData: Record<string, unknown>;
    /** 向组件报告上传进度。 */
    onProgress: (percent: number) => void;
}

/** 自定义上传适配器的标准成功结果。 */
export interface SnakeUploadRequestResult extends Record<string, unknown> {
    /** 上传完成后的公开访问地址。 */
    url: string;
    /** OSS 或业务接口的原始响应。 */
    response?: unknown;
    /** 可选的新文件名。 */
    name?: string;
}

/** 自定义上传函数，可用于 OSS、腾讯云、七牛或业务上传接口。 */
export type SnakeUploadRequest = (
    file: SnakeUploadFileItem,
    context: SnakeUploadRequestContext
) => Promise<SnakeUploadRequestResult | string>;

/** Snake Upload 的运行时 props 定义。 */
export const snakeUploadProps = {
    customStyle: { type: [String, Object] as PropType<SnakeStyleValue>, default: '' },
    customClass: { type: String, default: '' },
    width: { type: [Number, String], default: 200 },
    height: { type: [Number, String], default: 200 },
    maxCount: { type: [Number, String], default: 52 },
    deletable: { type: Boolean, default: true },
    mode: { type: String as PropType<'grid' | 'list'>, default: 'grid' },
    showUploadList: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true },
    delBgColor: { type: String, default: 'var(--snake-color-error, #fa3534)' },
    delIcon: { type: String, default: 'close' },
    delColor: { type: String, default: '#fff' },
    imageMode: { type: String as PropType<SnakeImageMode>, default: 'aspectFill' },
    customBtn: { type: Boolean, default: false },
    uploadText: { type: String, default: '' },
    action: { type: String, default: '' },
    timeout: { type: Number, default: 60_000 },
    disabled: { type: Boolean, default: false },
    index: { type: [String, Number], default: '' },
    header: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    formData: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    name: { type: String, default: 'file' },
    sizeType: { type: Array as PropType<Array<'original' | 'compressed'>>, default: () => ['original', 'compressed'] },
    sourceType: { type: Array as PropType<Array<'album' | 'camera'>>, default: () => ['album', 'camera'] },
    previewFullImage: { type: Boolean, default: true },
    previewFile: { type: Boolean, default: true },
    multiple: { type: Boolean, default: true },
    maxSize: { type: [Number, String], default: Number.MAX_VALUE },
    modelValue: { type: Array as PropType<SnakeUploadFileItem[]>, default: () => [] },
    fileList: { type: Array as PropType<SnakeUploadFileItem[]>, default: () => [] },
    limitType: { type: Array as PropType<string[]>, default: () => [] },
    autoUpload: { type: Boolean, default: true },
    showTips: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: true },
    beforeUpload: {
        type: Function as PropType<(index: number, files: SnakeUploadFileItem[]) => boolean | Promise<unknown>>,
        default: undefined
    },
    beforeRemove: {
        type: Function as PropType<(index: number, files: SnakeUploadFileItem[]) => boolean | Promise<unknown>>,
        default: undefined
    },
    toJson: { type: Boolean, default: true },
    accept: { type: String as PropType<SnakeUploadAcceptType>, default: 'image' },
    showFileName: { type: Boolean, default: true },
    showFileSize: { type: Boolean, default: false },
    fileIconMap: {
        type: Object as PropType<Record<string, { name: string; color?: string }>>,
        default: () => ({})
    },
    compressed: { type: Boolean, default: true },
    maxDuration: { type: Number, default: 60 },
    camera: { type: String as PropType<'front' | 'back'>, default: 'back' },
    extension: { type: Array as PropType<string[]>, default: () => [] },
    imageShape: { type: String as PropType<'square' | 'circle'>, default: 'square' },
    customChoose: { type: Boolean, default: false },
    uploadRequest: { type: Function as PropType<SnakeUploadRequest>, default: undefined },
    isCustomUpload: { type: Boolean, default: false }
};

/** Snake Upload 的公开属性类型。 */
export type SnakeUploadProps = ExtractPropTypes<typeof snakeUploadProps>;

/** 通过组件 ref 可调用的方法。 */
export interface SnakeUploadExpose {
    /** 当前内部文件列表。 */
    lists: SnakeUploadFileItem[];
    /** 清空文件列表。 */
    clear: () => void;
    /** 上传所有待上传文件。 */
    upload: () => void;
    /** 重传全部失败文件或指定文件。 */
    reUpload: (index?: number) => void;
    /** 重试指定文件。 */
    retry: (index: number) => void;
    /** 直接移除指定文件。 */
    remove: (index: number) => void;
    /** 按组件交互规则删除指定文件。 */
    deleteItem: (index: number) => void;
    /** 打开文件选择器。 */
    selectFile: () => void;
    /** 将外部选择的文件加入上传队列。 */
    addFiles: (files: SnakeUploadFileItem[]) => void;
    /** 兼容旧组件，将文件交给 beforeRead/afterRead 流程。 */
    onBeforeRead: (file: SnakeUploadFileItem | SnakeUploadFileItem[]) => void;
}
