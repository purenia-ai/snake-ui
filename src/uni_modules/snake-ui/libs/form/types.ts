export type SnakeFormTrigger = 'change' | 'blur';
export type SnakeFormRuleType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'date'
    | 'url'
    | 'hex'
    | 'email'
    | 'any';
export type SnakeFormValidatorResult = boolean | string | Error | void;
export type SnakeFormValidatorCallback = (error?: string | Error) => void;

export interface SnakeFormRule {
    required?: boolean;
    type?: SnakeFormRuleType;
    min?: number;
    max?: number;
    len?: number;
    enum?: unknown[];
    pattern?: RegExp | string;
    whitespace?: boolean;
    message?: string;
    trigger?: SnakeFormTrigger | SnakeFormTrigger[];
    transform?: (value: unknown) => unknown;
    validator?: (
        rule: SnakeFormRule,
        value: unknown,
        callback: SnakeFormValidatorCallback
    ) => SnakeFormValidatorResult | Promise<SnakeFormValidatorResult>;
    asyncValidator?: (
        rule: SnakeFormRule,
        value: unknown,
        callback: SnakeFormValidatorCallback
    ) => SnakeFormValidatorResult | Promise<SnakeFormValidatorResult>;
    fields?: SnakeFormRules;
    defaultField?: SnakeFormRule | SnakeFormRule[];
}

export type SnakeFormRules = Record<string, SnakeFormRule | SnakeFormRule[]>;
export interface SnakeFormError {
    prop: string;
    message: string;
    rule?: SnakeFormRule;
}
