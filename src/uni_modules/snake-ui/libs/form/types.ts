export type FormTrigger = 'change' | 'blur';
export type FormRuleType =
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
export type FormValidatorResult = boolean | string | Error | void;
export type FormValidatorCallback = (error?: string | Error) => void;

export interface FormRule {
    required?: boolean;
    type?: FormRuleType;
    min?: number;
    max?: number;
    len?: number;
    enum?: unknown[];
    pattern?: RegExp | string;
    whitespace?: boolean;
    message?: string;
    trigger?: FormTrigger | FormTrigger[];
    transform?: (value: unknown) => unknown;
    validator?: (
        rule: FormRule,
        value: unknown,
        callback: FormValidatorCallback
    ) => FormValidatorResult | Promise<FormValidatorResult>;
    asyncValidator?: (
        rule: FormRule,
        value: unknown,
        callback: FormValidatorCallback
    ) => FormValidatorResult | Promise<FormValidatorResult>;
    fields?: FormRules;
    defaultField?: FormRule | FormRule[];
}

export type FormRules = Record<string, FormRule | FormRule[]>;
export interface FormError {
    prop: string;
    message: string;
    rule?: FormRule;
}
