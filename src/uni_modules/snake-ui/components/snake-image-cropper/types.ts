import type { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 导出文件格式。 */
export type ImageCropperFileType = 'png' | 'jpg';

/**
 * snake-image-cropper 运行时属性。
 *
 * `modelValue` 与 `show` 都不给默认值（`undefined`）：只有缺省状态才能区分「调用方没绑」与
 * 「绑了一个 false」，显隐因此可以写成 `modelValue ?? show ?? false`。
 */
export const imageCropperProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 双向绑定的显隐。 */
    modelValue: { type: Boolean, default: undefined },
    /** 显隐，`modelValue` 的等价写法，二者同时绑定时 `modelValue` 优先。 */
    show: { type: Boolean, default: undefined },
    /** 待裁剪图片地址，支持本地与网络地址。 */
    src: { type: String, default: '' },
    /** 裁剪框宽高比，`宽:高` 或 `宽/高`。 */
    aspectRatio: { type: String, default: '1:1' },
    /** 最大放大倍数，相对「铺满裁剪框」的初始态。 */
    maxScale: { type: Number, default: 3 },
    /** 导出像素倍数。 */
    exportScale: { type: Number, default: 2 },
    /** 导出文件格式。 */
    fileType: { type: String as PropType<ImageCropperFileType>, default: 'png' },
    /** jpg 质量，0–1，png 下无效。 */
    quality: { type: Number, default: 1 },
    /** 是否禁用到旋转。 */
    disabledRotate: { type: Boolean, default: false },
    /** 图片初始宽度，数字按 px、字符串支持 `%`；一般不传。 */
    imgWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    /** 图片初始高度，规则同 `imgWidth`；一般不传。 */
    imgHeight: { type: [Number, String] as PropType<number | string>, default: undefined },
    /** 取消文案，空则取语言包 `common.cancel`。 */
    cancelText: { type: String, default: '' },
    /** 确认文案，空则取语言包 `common.confirm`。 */
    confirmText: { type: String, default: '' },
    /** 层级，缺省取 `zIndex.popup`。 */
    zIndex: { type: Number, default: undefined },
    /** 是否阻止页面跟随触摸滚动。 */
    lockScroll: { type: Boolean, default: true },
    /** 底部操作区是否避让安全区。 */
    safeAreaInsetBottom: { type: Boolean, default: true }
} as const;

/** snake-image-cropper 解析后的属性。 */
export type ImageCropperResolvedProps = ExtractPropTypes<typeof imageCropperProps>;

/** snake-image-cropper 对外属性。 */
export interface ImageCropperProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 双向绑定的显隐。 */
    modelValue?: boolean;
    /** 显隐，`modelValue` 的等价写法。 */
    show?: boolean;
    /** 待裁剪图片地址。 */
    src?: string;
    /** 裁剪框宽高比。 */
    aspectRatio?: string;
    /** 最大放大倍数。 */
    maxScale?: number;
    /** 导出像素倍数。 */
    exportScale?: number;
    /** 导出文件格式。 */
    fileType?: ImageCropperFileType;
    /** jpg 质量。 */
    quality?: number;
    /** 是否禁止旋转。 */
    disabledRotate?: boolean;
    /** 图片初始宽度。 */
    imgWidth?: number | string;
    /** 图片初始高度。 */
    imgHeight?: number | string;
    /** 取消文案。 */
    cancelText?: string;
    /** 确认文案。 */
    confirmText?: string;
    /** 层级。 */
    zIndex?: number;
    /** 是否阻止页面滚动。 */
    lockScroll?: boolean;
    /** 底部操作区是否避让安全区。 */
    safeAreaInsetBottom?: boolean;
}

/** 裁剪结果。 */
export interface ImageCropperResult {
    /** 生成文件的临时路径（H5 为 base64 形式）。 */
    tempFilePath: string;
    /** 导出像素宽。 */
    width: number;
    /** 导出像素高。 */
    height: number;
}

/** 图片信息读取结果。 */
export interface ImageCropperImageInfo {
    /** 原图宽。 */
    width: number;
    /** 原图高。 */
    height: number;
    /** 本地路径；小程序端绘制必须用它，不能用网络地址。 */
    path: string;
}

/** 图片读取失败详情。 */
export interface ImageCropperError {
    /** 出错的地址。 */
    src: string;
    /** 平台返回的错误信息，可能为空串。 */
    errMsg: string;
}

/** snake-image-cropper 事件。 */
export type ImageCropperEmits = {
    /** 关闭时回写 `v-model`。 */
    'update:modelValue': [value: boolean];
    /** 关闭时回写 `show`。 */
    'update:show': [value: boolean];
    /** 导出完成。 */
    confirm: [result: ImageCropperResult];
    /** 用户点击取消。 */
    cancel: [];
    /** 图片信息读取成功。 */
    imgloaded: [info: ImageCropperImageInfo];
    /** 图片读取失败。 */
    imgloaderror: [error: ImageCropperError];
};

/** snake-image-cropper 通过 ref 暴露的方法。 */
export interface ImageCropperExpose {
    /** 设置旋转角度，非 90 倍数会被归整。 */
    setRotate(angle: number): void;
    /** 回到初始态：角度归零、缩放铺满、居中。 */
    reset(): void;
}

/** 组件实例类型，供 `ref<ImageCropperInstance>()` 使用。 */
export type ImageCropperInstance = ComponentPublicInstance<ImageCropperProps, ImageCropperExpose>;

/** 对外导出的实例类型别名，避免调用方再引 `vue` 的公共类型。 */
export type ImageCropperRef = ImageCropperInstance;
