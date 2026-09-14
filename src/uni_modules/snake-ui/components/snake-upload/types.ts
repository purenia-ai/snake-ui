import type { ExtractPropTypes, PropType } from 'vue';
import type { ImageMode, StyleValue } from '../../types/global';

/** 可选择的文件类别。 */
export type UploadAcceptType = 'image' | 'video' | 'file' | 'media' | 'all';
/** 标准化后的文件类别。 */
export type UploadFileType = 'image' | 'video' | 'file';
/** 文件在上传队列中的状态。 */
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'failed';

/** Snake Upload 使用的文件记录。 */
export interface UploadFileItem extends Record<string, unknown> {
    /** 预览或上传完成后的 URL。 */
    url?: string;
    /** 本地临时文件路径。 */
    path?: string;
    /** 文件名。 */
    name?: string;
    /** 文件字节数。 */
    size?: number;
    /** 标准化文件类别。 */
    fileType?: UploadFileType;
    /** 队列状态。 */
    status?: UploadStatus;
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
export interface UploadRequestContext {
    /** 当前文件索引。 */
    index: number;
    /** 当前文件列表快照。 */
    files: readonly UploadFileItem[];
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
export interface UploadRequestResult extends Record<string, unknown> {
    /** 上传完成后的公开访问地址。 */
    url: string;
    /** OSS 或业务接口的原始响应。 */
    response?: unknown;
    /** 可选的新文件名。 */
    name?: string;
}

/** 自定义上传函数，可用于 OSS、腾讯云、七牛或业务上传接口。 */
export type UploadRequest = (file: UploadFileItem, context: UploadRequestContext) => Promise<UploadRequestResult | string>;

/** Upload 回调中用于区分组件实例的索引。 */
export type UploadIndex = string | number;

/** Upload 选择、超限和预览等事件的统一载荷。 */
export interface UploadFileEvent {
    /** 关联的文件。 */
    file: UploadFileItem | UploadFileItem[];
    /** 上传字段名称。 */
    name: string;
    /** 文件在列表中的起始位置。 */
    index: number;
}

/** Upload 自定义选取事件的载荷。 */
export interface UploadChooseEvent {
    /** 当前允许的文件类型。 */
    accept: UploadAcceptType;
    /** 本次还能选择的文件数。 */
    maxCount: number | string;
    /** 当前文件列表快照。 */
    fileList: UploadFileItem[];
    /** 调用方传入的组件索引。 */
    index: UploadIndex;
}

/** Upload 旧版 customUpload 事件的载荷。 */
export interface UploadLegacyCustomEvent {
    /** 当前允许的文件类型。 */
    accept: UploadAcceptType;
    /** 是否允许多选。 */
    multiple: boolean;
    /** 可用的文件来源。 */
    capture: Array<'album' | 'camera'>;
    /** 是否压缩视频。 */
    compressed: boolean;
    /** 视频最长时长。 */
    maxDuration: number;
    /** 图像尺寸策略。 */
    sizeType: Array<'original' | 'compressed'>;
    /** 视频摄像头方向。 */
    camera: 'front' | 'back';
    /** 本次还能选择的文件数。 */
    maxCount: number;
    /** 调用默认文件选择器。 */
    chooseFile: (options?: Record<string, unknown>) => Promise<unknown[]>;
}

/** Upload 组件的事件契约。 */
export type UploadEmits = {
    /** 双向绑定文件列表。 */
    'update:modelValue': [files: UploadFileItem[]];
    /** 文件列表变化。 */
    'on-list-change': [files: UploadFileItem[], index: UploadIndex];
    /** 文件超出单文件大小限制。 */
    'on-oversize': [file: UploadFileItem, files: UploadFileItem[], index: UploadIndex];
    /** 文件超出数量限制。 */
    'on-exceed': [file: UploadFileItem, files: UploadFileItem[], index: UploadIndex];
    /** 请求调用方自行选择文件。 */
    'on-choose': [detail: UploadChooseEvent];
    /** 文件选择完成。 */
    'on-choose-complete': [files: UploadFileItem[], index: UploadIndex];
    /** 文件选择失败。 */
    'on-choose-fail': [error: unknown];
    /** 全部文件上传完成。 */
    'on-uploaded': [files: UploadFileItem[], index: UploadIndex];
    /** 单文件上传成功。 */
    'on-success': [response: unknown, index: number, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 单文件上传失败。 */
    'on-error': [error: unknown, index: number, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 单文件上传状态变化。 */
    'on-change': [result: unknown, index: number, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 上传进度变化。 */
    'on-progress': [progress: unknown, index: number, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 文件移除完成。 */
    'on-remove': [index: number, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 文件预览。 */
    'on-preview': [url: string | undefined, files: UploadFileItem[], componentIndex: UploadIndex];
    /** 兼容旧版自定义上传。 */
    customUpload: [detail: UploadLegacyCustomEvent];
    /** 开始选择文件。 */
    chooseStart: [];
    /** 选择文件结束。 */
    chooseComplete: [];
    /** 兼容旧版错误事件。 */
    error: [error: unknown];
    /** 文件进入读取流程前。 */
    beforeRead: [detail: UploadFileEvent];
    /** 文件进入读取流程后。 */
    afterRead: [detail: UploadFileEvent];
    /** 兼容旧版超限事件。 */
    oversize: [detail: UploadFileEvent];
    /** 兼容旧版删除事件。 */
    delete: [detail: UploadFileItem & { name: string; index: number }];
    /** 兼容旧版预览事件。 */
    clickPreview: [detail: UploadFileItem & { name: string; index: number }];
};

/** Snake Upload 的运行时 props 定义。 */
export const uploadProps = {
    customStyle: { type: [String, Object] as PropType<StyleValue>, default: '' },
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
    imageMode: { type: String as PropType<ImageMode>, default: 'aspectFill' },
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
    modelValue: { type: Array as PropType<UploadFileItem[]>, default: () => [] },
    fileList: { type: Array as PropType<UploadFileItem[]>, default: () => [] },
    limitType: { type: Array as PropType<string[]>, default: () => [] },
    autoUpload: { type: Boolean, default: true },
    showTips: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: true },
    beforeUpload: {
        type: Function as PropType<(index: number, files: UploadFileItem[]) => boolean | Promise<unknown>>,
        default: undefined
    },
    beforeRemove: {
        type: Function as PropType<(index: number, files: UploadFileItem[]) => boolean | Promise<unknown>>,
        default: undefined
    },
    toJson: { type: Boolean, default: true },
    accept: { type: String as PropType<UploadAcceptType>, default: 'image' },
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
    uploadRequest: { type: Function as PropType<UploadRequest>, default: undefined },
    isCustomUpload: { type: Boolean, default: false }
};

/** Snake Upload 的公开属性类型。 */
export type UploadProps = ExtractPropTypes<typeof uploadProps>;

/** 通过组件 ref 可调用的方法。 */
export interface UploadExpose {
    /** 当前内部文件列表。 */
    lists: UploadFileItem[];
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
    addFiles: (files: UploadFileItem[]) => void;
    /** 兼容旧组件，将文件交给 beforeRead/afterRead 流程。 */
    onBeforeRead: (file: UploadFileItem | UploadFileItem[]) => void;
}
