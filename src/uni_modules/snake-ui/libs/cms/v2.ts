import type { CmsV2BuiltinComponent } from './blocks';

type Dictionary = Record<string, any>;

const link = () => ({ httpType: 10, http: '' });
const mediaStyle = () => ({
    heightMode: 'auto',
    height: 200,
    pageMargin: 0,
    imageRadius: 0,
    backgroundColor: '#FFFFFF'
});

export const cmsV2Defaults: Record<CmsV2BuiltinComponent, Dictionary> = {
    'v2.carousel': {
        play: { autoplay: true, interval: 3, loop: true },
        indicator: { type: 'bullets', color: '#1989fa' },
        style: mediaStyle(),
        items: []
    },
    'v2.coupon': {
        mode: 'page',
        popupMode: 'bottom',
        coupon: null,
        before: { image: '', link: link() },
        after: { image: '', link: link() }
    },
    'v2.custom': { slotName: 'custom' },
    'v2.divider': {
        mode: 'blank',
        height: 30,
        lineStyle: 'solid',
        margin: 0,
        style: { lineColor: 'rgb(229, 229, 229)', backgroundColor: 'rgb(255, 255, 255)' }
    },
    'v2.floatbutton': {
        src: '',
        link: link(),
        position: { right: 0, bottom: 20 },
        style: { width: 76, height: 76 }
    },
    'v2.goodslist': {
        audience: 'all',
        query: {
            source: 'activity',
            activityId: '',
            activityType: '',
            activityStatus: 'ing',
            userRule: 'all',
            gender: [],
            low: '',
            high: '',
            categoryId: '',
            brands: [],
            sellingDays: '',
            sort: 'auto',
            pageSize: 20,
            showOutOfStock: false
        },
        display: {
            layout: 'grid',
            columns: 2,
            cardType: 'sale',
            subType: '',
            showAttendance: true,
            showTag: false
        },
        bars: {
            filter: false,
            filterList: [],
            priceFilter: true,
            tabs: { enabled: false, list: [] },
            activitySession: false,
            sticky: false
        },
        style: { pageMargin: 5, gap: 10, radius: 0, backgroundColor: '#F8F8F8' },
        empty: { mode: 'default', image: '', text: '列表为空', color: '#000000' }
    },
    'v2.hotzone': { image: '', zones: [] },
    'v2.images': {
        layout: { mode: 'single', columns: 2 },
        style: { ...mediaStyle(), gap: 8 },
        items: []
    },
    'v2.magiccube': {
        layout: 'row',
        columns: 4,
        cells: [],
        play: { interval: 3 },
        style: { pageMargin: 0, gap: 0, radius: 0, height: 188, backgroundColor: '#FFFFFF' }
    },
    'v2.notice': {
        direction: 'row',
        noticeText: '请填写内容，如果过长，将会在手机上滚动显示',
        link: link(),
        textList: [],
        isLeftIcon: true,
        style: {
            height: 72,
            pageMargin: 10,
            backgroundColor: 'rgb(234, 241, 255)',
            textColor: 'rgb(45, 87, 231)'
        }
    },
    'v2.popup': { image: '', link: link(), popupMode: 'bottom' },
    'v2.richtext': { content: '', style: { backgroundColor: '#FFFFFF' } },
    'v2.search': {
        searchText: '请输入你想要搜索的商品名称/货号/关键词',
        link: link(),
        isSearch: false,
        inputType: 'text',
        textList: [],
        rightImage: { show: false, src: '', link: link(), width: 60, height: 60, borderRadius: 0, marginRight: 0 },
        icons: [],
        style: {
            position: 0,
            height: 60,
            pageMargin: 0,
            borderRadius: 0,
            backgroundColor: 'rgb(249, 249, 249)',
            borderBgColor: 'rgb(255, 255, 255)',
            textColor: 'rgb(150, 151, 153)',
            borderSize: 1,
            borderColor: 'rgb(0, 0, 0)',
            showBorder: true
        }
    },
    'v2.video': { src: '', coverUrl: '', autoplay: false, style: mediaStyle() }
};

const enums: Record<string, readonly unknown[]> = {
    'v2.carousel:indicator.type': ['none', 'bullets', 'fraction', 'progressbar'],
    'v2.coupon:mode': ['page', 'popup'],
    'v2.coupon:popupMode': ['bottom', 'center'],
    'v2.divider:mode': ['blank', 'line'],
    'v2.divider:lineStyle': ['solid', 'dashed', 'dotted'],
    'v2.goodslist:audience': ['all', 'new', 'old'],
    'v2.goodslist:query.source': ['activity', 'condition'],
    'v2.goodslist:display.layout': ['grid', 'swipe'],
    'v2.goodslist:display.columns': [2, 3],
    'v2.goodslist:display.cardType': ['sale', 'auction', 'new'],
    'v2.images:layout.mode': ['single', 'grid'],
    'v2.notice:direction': ['row', 'column'],
    'v2.popup:popupMode': ['bottom', 'center'],
    'v2.search:inputType': ['text', 'number'],
    'v2.search:style.position': [0, 1]
};

const limits: Record<string, [number, number]> = {
    'v2.carousel:play.interval': [1, 3600],
    'v2.goodslist:query.pageSize': [1, 50],
    'v2.images:layout.columns': [1, 4],
    'v2.magiccube:columns': [1, 6],
    'v2.search:style.height': [60, 80]
};

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function normalizeValue(value: unknown, fallback: any, component: string, path: string): any {
    if (Array.isArray(fallback)) return Array.isArray(value) ? clone(value) : clone(fallback);
    if (fallback !== null && typeof fallback === 'object') {
        const source =
            value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Dictionary) : {};
        return Object.fromEntries(
            Object.entries(fallback).map(([key, nested]) => [
                key,
                normalizeValue(source[key], nested, component, path ? `${path}.${key}` : key)
            ])
        );
    }
    if (fallback === null) return value === undefined ? null : clone(value);
    const enumValues = enums[`${component}:${path}`];
    if (typeof fallback === 'boolean') {
        if (value === true || value === 1 || value === '1' || value === 'true') return true;
        if (value === false || value === 0 || value === '0' || value === 'false') return false;
        return fallback;
    }
    if (typeof fallback === 'number') {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return fallback;
        if (enumValues && !enumValues.includes(numeric)) return fallback;
        const limit = limits[`${component}:${path}`];
        return limit ? Math.min(limit[1], Math.max(limit[0], numeric)) : numeric;
    }
    const text = typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
    return enumValues && !enumValues.includes(text) ? fallback : text;
}

export function normalizeCmsV2Props(component: CmsV2BuiltinComponent, value: unknown): Dictionary {
    return normalizeValue(value, cmsV2Defaults[component], component, '');
}
