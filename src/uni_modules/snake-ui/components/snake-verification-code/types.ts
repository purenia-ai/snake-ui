import type { Ref } from 'vue';
/** VerificationCode 组件的公开属性。 */
export interface VerificationCodeProps {
    /** 倒计时时长，单位秒。 */
    seconds?: number | string;
    /** 开始前文案，未设置时使用语言包默认值。 */
    startText?: string;
    /** 倒计时进行中文案，其中的 x 或 X 会被替换为剩余秒数，未设置时使用语言包默认值。 */
    changeText?: string;
    /** 倒计时结束文案，未设置时使用语言包默认值。 */
    endText?: string;
    /** 页面离开或刷新后再次进入时是否继续剩余倒计时。 */
    keepRunning?: boolean;
    /** keepRunning 时区分多个倒计时的存储键后缀。 */
    uniqueKey?: string;
}
/** VerificationCode 组件的事件契约。 */
export type VerificationCodeEmits = {
    /** 倒计时期间每秒触发，携带当前文案。 */
    change: [text: string];
    /** 开始倒计时触发。 */
    start: [];
    /** 倒计时结束触发。 */
    end: [];
};
/** VerificationCode 组件暴露的方法与状态。 */
export interface VerificationCodeExpose {
    /** 开始倒计时，倒计时进行中调用无效。 */
    start: () => void;
    /** 重置倒计时并恢复可获取状态。 */
    reset: () => void;
    /** 是否可以获取验证码。 */
    canGetCode: Ref<boolean>;
}
