export type DemoValue = string | number | boolean;

export interface DemoOption {
    label: string;
    value: DemoValue;
}

export interface DemoControl {
    key: string;
    label: string;
    type: 'select' | 'switch' | 'slider' | 'input';
    defaultValue: DemoValue;
    /** 只读：demo 页用 `as const satisfies readonly DemoControl[]` 声明控件，才能保留下拉项字面量。 */
    options?: readonly DemoOption[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    placeholder?: string;
}

export interface DemoDefinition {
    category: string;
    description: string;
    controls: DemoControl[];
}

export type DemoTab = 'components' | 'tools' | 'scenes' | 'templates' | 'about';

export type DemoCatalogBadge = 'new' | 'cms' | 'business';

export interface DemoCatalogItem {
    key: string;
    path: string;
    kind?: 'scene' | 'component';
    title: string;
    titleEn: string;
    desc: string;
    icon?: string;
    category?: string;
    tags?: string[];
    badge?: DemoCatalogBadge;
}

export interface DemoCatalogGroup {
    key: string;
    title: string;
    titleEn: string;
    icon: string;
    items: DemoCatalogItem[];
}
