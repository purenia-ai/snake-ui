import type {
    SnakeFormError,
    SnakeFormRule,
    SnakeFormRules,
    SnakeFormTrigger,
    SnakeFormValidatorCallback,
    SnakeFormValidatorResult
} from './types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^(https?|ftp):\/\/[^\s]+$/i;
const hexPattern = /^#?(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;

function empty(value: unknown): boolean {
    return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}
function lengthOf(value: unknown): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' || Array.isArray(value)) return value.length;
    return undefined;
}
function defaultMessage(rule: SnakeFormRule): string {
    if (rule.required) return '此项为必填项';
    if (rule.len != null) return `长度必须为 ${rule.len}`;
    if (rule.min != null && rule.max != null) return `长度或数值应在 ${rule.min}-${rule.max} 之间`;
    if (rule.min != null) return `长度或数值不能小于 ${rule.min}`;
    if (rule.max != null) return `长度或数值不能大于 ${rule.max}`;
    return '格式不正确';
}
function typeMatches(type: SnakeFormRule['type'], value: unknown): boolean {
    if (!type || type === 'any') return true;
    if (type === 'array') return Array.isArray(value);
    if (type === 'date') {
        const date = typeof value === 'number' ? new Date(value) : value;
        return date instanceof Date && !Number.isNaN(date.getTime());
    }
    if (type === 'regexp') return value instanceof RegExp;
    if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
    if (type === 'float') return typeof value === 'number' && Number.isFinite(value);
    if (type === 'method') return typeof value === 'function';
    if (type === 'url') return typeof value === 'string' && urlPattern.test(value);
    if (type === 'email') return typeof value === 'string' && emailPattern.test(value);
    if (type === 'hex') return typeof value === 'string' && hexPattern.test(value);
    if (type === 'number') return typeof value === 'number' && !Number.isNaN(value);
    return typeof value === type;
}
function normalizeCustomResult(result: SnakeFormValidatorResult, fallback: string): string | undefined {
    if (result === false) return fallback;
    if (typeof result === 'string') return result;
    if (result instanceof Error) return result.message || fallback;
    return undefined;
}

async function runCustom(rule: SnakeFormRule, value: unknown): Promise<string | undefined> {
    const validator = rule.asyncValidator || rule.validator;
    if (!validator) return undefined;
    return new Promise(resolve => {
        let completed = false;
        const done: SnakeFormValidatorCallback = error => {
            if (completed) return;
            completed = true;
            resolve(typeof error === 'string' ? error : error?.message);
        };
        try {
            const result = validator(rule, value, done);
            if (result && typeof (result as Promise<SnakeFormValidatorResult>).then === 'function') {
                void (result as Promise<SnakeFormValidatorResult>)
                    .then(value => {
                        if (!completed) {
                            completed = true;
                            resolve(normalizeCustomResult(value, rule.message || '校验失败'));
                        }
                    })
                    .catch(error => done(error instanceof Error ? error : String(error)));
            } else if (result !== undefined) {
                completed = true;
                resolve(normalizeCustomResult(result as SnakeFormValidatorResult, rule.message || '校验失败'));
            } else if (validator.length < 3) {
                completed = true;
                resolve(undefined);
            }
        } catch (error) {
            done(error instanceof Error ? error : String(error));
        }
    });
}

export function ruleMatchesTrigger(rule: SnakeFormRule, trigger?: SnakeFormTrigger): boolean {
    if (!trigger || !rule.trigger) return true;
    return (Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]).includes(trigger);
}

export async function validateFormValue(
    prop: string,
    rawValue: unknown,
    rules: SnakeFormRule | SnakeFormRule[],
    trigger?: SnakeFormTrigger
): Promise<SnakeFormError[]> {
    const list = (Array.isArray(rules) ? rules : [rules]).filter(rule => ruleMatchesTrigger(rule, trigger));
    const errors: SnakeFormError[] = [];
    for (const rule of list) {
        const value = rule.transform ? rule.transform(rawValue) : rawValue;
        let message: string | undefined;
        if (rule.required && empty(value)) message = rule.message || defaultMessage(rule);
        else if (!empty(value)) {
            const length = lengthOf(value);
            if (!typeMatches(rule.type, value)) message = rule.message || defaultMessage(rule);
            else if (rule.len != null && length !== rule.len) message = rule.message || defaultMessage(rule);
            else if (rule.min != null && length != null && length < rule.min)
                message = rule.message || defaultMessage(rule);
            else if (rule.max != null && length != null && length > rule.max)
                message = rule.message || defaultMessage(rule);
            else if (rule.enum && !rule.enum.includes(value)) message = rule.message || defaultMessage(rule);
            else if (rule.pattern) {
                const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
                pattern.lastIndex = 0;
                if (!pattern.test(String(value))) message = rule.message || defaultMessage(rule);
            } else if (rule.whitespace && typeof value === 'string' && /^\s+$/.test(value)) {
                message = rule.message || defaultMessage(rule);
            } else message = await runCustom(rule, value);

            if (!message && value && (rule.fields || rule.defaultField) && typeof value === 'object') {
                const childRules: SnakeFormRules = { ...(rule.fields || {}) };
                if (rule.defaultField) {
                    for (const key of Object.keys(value as Record<string, unknown>)) {
                        if (!childRules[key]) childRules[key] = rule.defaultField;
                    }
                }
                for (const [key, childRule] of Object.entries(childRules)) {
                    const childErrors = await validateFormValue(
                        `${prop}.${key}`,
                        (value as Record<string, unknown>)[key],
                        childRule,
                        trigger
                    );
                    if (childErrors.length) {
                        message = childErrors[0].message;
                        break;
                    }
                }
            }
        }
        if (message) {
            errors.push({ prop, message, rule });
            break;
        }
    }
    return errors;
}
