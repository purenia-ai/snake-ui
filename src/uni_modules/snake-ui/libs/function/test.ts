/**
 * 常用校验套件，便于组件移植直接引用。
 * snake 原有校验器语义保持不变：number 为 Number.isFinite 版、object 为纯对象判定、
 * empty 对 null/''/空数组/空对象返回 true。
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}

/** 验证电子邮箱格式。 */
function email(value: unknown): boolean {
    return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
        String(value)
    );
}

/** 验证手机号格式（大陆 1[3-9] 段）。 */
function mobile(value: unknown): boolean {
    return /^1[3-9]\d{9}$/.test(String(value));
}

/** 验证 URL 格式。 */
function url(value: unknown): boolean {
    return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/.test(String(value));
}

/** 验证可被 Date 解析的日期格式。 */
function date(value: unknown): boolean {
    return !/Invalid|NaN/.test(new Date(String(value)).toString());
}

/** 验证 ISO 类型的日期格式（yyyy/mm/dd 或 yyyy-mm-dd）。 */
function dateISO(value: unknown): boolean {
    return /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/.test(String(value));
}

/** 验证十进制数字（snake 语义：Number.isFinite，非正则）。 */
function number(value: unknown): boolean {
    return value !== '' && Number.isFinite(Number(value));
}

/** 验证纯整数。 */
function digits(value: unknown): boolean {
    return /^\d+$/.test(String(value));
}

/** 验证身份证号码。 */
function idCard(value: unknown): boolean {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(String(value));
}

/** 验证车牌号（含新能源 8 位与传统能源 7 位）。 */
function carNo(value: unknown): boolean {
    const input = String(value);
    // 新能源车牌
    const xreg =
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    // 旧车牌
    const creg =
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (input.length === 7) return creg.test(input);
    if (input.length === 8) return xreg.test(input);
    return false;
}

/** 验证金额（最多 2 位小数，支持千分位）。 */
function amount(value: unknown): boolean {
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(String(value));
}

/** 验证纯中文。 */
function chinese(value: unknown): boolean {
    return /^[一-龥]+$/gi.test(String(value));
}

/** 验证纯字母。 */
function letter(value: unknown): boolean {
    return /^[a-zA-Z]*$/.test(String(value));
}

/** 验证字母或数字。 */
function enOrNum(value: unknown): boolean {
    return /^[0-9a-zA-Z]*$/g.test(String(value));
}

/** 验证是否包含某个值。 */
function contains(value: unknown, param: string): boolean {
    return String(value).indexOf(param) >= 0;
}

/** 验证数值范围 [min, max]。 */
function range(value: number, param: [number, number]): boolean {
    return value >= param[0] && value <= param[1];
}

/** 验证字符串长度范围 [min, max]。 */
function rangeLength(value: string, param: [number, number]): boolean {
    return value.length >= param[0] && value.length <= param[1];
}

/** 验证固定电话。 */
function landline(value: unknown): boolean {
    return /^\d{3,4}-\d{7,8}(-\d{3,4})?$/.test(String(value));
}

/** 判断是否为空（snake 语义：null/undefined/''/空数组/空对象）。 */
function empty(value: unknown): boolean {
    return (
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (isPlainObject(value) && Object.keys(value).length === 0)
    );
}

/** 验证 JSON 字符串。 */
function jsonString(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null;
    } catch {
        return false;
    }
}

/** 验证短信验证码（默认 6 位数字）。 */
function code(value: unknown, len = 6): boolean {
    return new RegExp(`^\\d{${len}}$`).test(String(value));
}

/** 判断是否函数。 */
function func(value: unknown): value is (...args: unknown[]) => unknown {
    return typeof value === 'function';
}

/** 判断是否 Promise 形对象。 */
function promise(value: unknown): boolean {
    return (
        !!value &&
        typeof value === 'object' &&
        func((value as { then?: unknown }).then) &&
        func((value as { catch?: unknown }).catch)
    );
}

/** 判断是否图片格式地址。 */
function image(value: unknown): boolean {
    return /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i.test(String(value).split('?')[0]);
}

/** 判断是否视频格式地址。 */
function video(value: unknown): boolean {
    return /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i.test(String(value).split('?')[0]);
}

/** 判断是否正则对象。 */
function regExp(value: unknown): value is RegExp {
    return !!value && Object.prototype.toString.call(value) === '[object RegExp]';
}

/** 验证字符串类型。 */
function string(value: unknown): value is string {
    return typeof value === 'string';
}

export const test = {
    email,
    mobile,
    url,
    date,
    dateISO,
    number,
    digits,
    idCard,
    carNo,
    amount,
    chinese,
    letter,
    enOrNum,
    contains,
    range,
    rangeLength,
    empty,
    isEmpty: empty,
    jsonString,
    landline,
    object: isPlainObject,
    array: Array.isArray,
    code,
    func,
    promise,
    video,
    image,
    regExp,
    string
};

export type SnakeTestSuite = typeof test;
