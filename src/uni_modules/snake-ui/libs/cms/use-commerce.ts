import { computed, ref } from 'vue';
import type {
    CmsNormalizedComponent,
    CmsOptions,
    CmsPageInfo,
    CmsStateChange,
    CmsStatus
} from './types';
import { CmsError } from './types';
import { getRuntimeOptions } from '../runtime';

type Dictionary = Record<string, any>;

export interface CmsCommerceControllerOptions {
    pageInfo: () => CmsPageInfo;
    component: () => CmsNormalizedComponent | undefined;
    options: () => CmsOptions;
    onStateChange?: (state: CmsStateChange) => void;
    onError?: (error: CmsError) => void;
}

function valuesToQuery(input: unknown): Dictionary {
    if (!input || typeof input !== 'object') return {};
    return Object.fromEntries(
        Object.entries(input as Dictionary).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );
}

export function useCmsCommerce(input: CmsCommerceControllerOptions) {
    const goodsList = ref<Dictionary[]>([]);
    const filtersData = ref<Dictionary>({});
    const activityList = ref<Dictionary[]>([]);
    const activityCurrent = ref<string | number>('001');
    const tabsCurrent = ref(0);
    const auctionSetParams = ref<Dictionary>({});
    const status = ref<CmsStatus>('idle');
    const page = ref(1);
    const goodsParams = ref<Dictionary>({});
    const filterParams = ref<Dictionary>({});
    const tabsParams = ref<Dictionary>({});
    let generation = 0;
    let busy = false;

    function styleOf(component: CmsNormalizedComponent): Dictionary {
        if (component.version !== 2) return component.setStyle;
        const data = component.props || {};
        const query = data.query || {};
        const display = data.display || {};
        const bars = data.bars || {};
        const style = data.style || {};
        return {
            goodsListType: query.source === 'activity' ? 'activity' : 'activityCondition',
            listType: display.cardType || 'sale',
            subType: display.subType || '',
            attendanceShow: display.showAttendance !== false,
            commodityType: Number(display.columns) === 3 ? 1 : 0,
            activitySessionShow: Boolean(bars.activitySession),
            filterShow: bars.filter,
            priceFilterShow: Boolean(bars.priceFilter),
            tabShow: Boolean(bars.tabs?.enabled),
            tabslist: Array.isArray(bars.tabs?.list) ? bars.tabs.list : [],
            stickyDisabled: !bars.sticky,
            pageMargin: style.pageMargin,
            imageMargin: style.gap,
            backgroundColor: style.backgroundColor,
            listMode: data.empty?.mode,
            emptySrc: data.empty?.image,
            emptyText: data.empty?.text,
            emptyColor: data.empty?.color,
            filterParams: {
                ...query,
                pageSize: query.pageSize || 20,
                activityUserRule: query.userRule,
                sellingDay: query.sellingDays,
                brandNames: Array.isArray(query.brands) ? query.brands.map((brand: Dictionary) => brand.name) : [],
                genderFilter: query.gender
            }
        };
    }

    const goodsLoadingStatus = computed(() => {
        if (status.value === 'initial-loading' || status.value === 'loading-more') return 'loading';
        if (status.value === 'no-more') return 'nomore';
        return 'loadmore';
    });

    function snapshot(): CmsStateChange {
        return { status: status.value, page: page.value, itemCount: goodsList.value.length };
    }

    function setStatus(next: CmsStatus): void {
        status.value = next;
        input.onStateChange?.(snapshot());
    }

    function context(component: CmsNormalizedComponent, currentGeneration: number) {
        return { component, pageInfo: input.pageInfo(), generation: currentGeneration };
    }

    function cacheKey(component: CmsNormalizedComponent): string {
        const pageInfo = input.pageInfo();
        const pageId = pageInfo.pageId ?? pageInfo.id ?? 'default';
        return `${input.options().cachePrefix || 'snake-ui:cms'}:${pageId}:${component.id}:filters`;
    }

    function restoreFilters(component: CmsNormalizedComponent): void {
        const cache = getRuntimeOptions().cache;
        if (!cache) return;
        const cached = cache.get(cacheKey(component)) ?? cache.get('filterParams');
        filterParams.value = valuesToQuery(cached);
    }

    function persistFilters(component: CmsNormalizedComponent, value: Dictionary): void {
        getRuntimeOptions().cache?.set(cacheKey(component), value);
    }

    function buildFilterRequest(component: CmsNormalizedComponent, mode = ''): Dictionary {
        const style = styleOf(component);
        const params: Dictionary = {};
        if (style.goodsListType === 'activity' || goodsParams.value.activityId) {
            params.activityId = style.filterParams?.activityId || goodsParams.value.activityId || '';
        }
        if (style.listType === 'auction' && !['forSale', 'downBuy'].includes(mode)) {
            params.activityType = 'auction';
            params.subType = style.subType || '';
        }
        if (goodsParams.value.categoryId) params.categoryId = goodsParams.value.categoryId;
        return params;
    }

    function buildGoodsRequest(component: CmsNormalizedComponent, mode = ''): Dictionary {
        const style = styleOf(component);
        const configured = style.filterParams || {};
        const params: Dictionary = {
            page: page.value,
            size: configured.pageSize || 10,
            key: style.key || '',
            low: configured.low || '',
            high: configured.high || '',
            sellingDay: configured.sellingDay || '',
            cateId: configured.categoryId || goodsParams.value.categoryId || '',
            sort: configured.sort,
            showOutOfStock: goodsParams.value.activityStatus === 'init' ? 1 : configured.showOutOfStock || 0
        };
        if (style.goodsListType === 'activity') params.activityId = configured.activityId || '';
        if (goodsParams.value.activityId) params.activityId = goodsParams.value.activityId;
        if (style.goodsListType === 'activityCondition' && configured.activityType) {
            params.activityType = configured.activityType;
            params.activityStatus = configured.activityStatus;
            params.activityUserRule = configured.activityUserRule || '';
            params.activitySubType = style.subType || '';
        }
        if (goodsParams.value.activityStatus) params.activityStatus = goodsParams.value.activityStatus;
        Object.assign(params, tabsParams.value, filterParams.value);
        for (const [target, source] of [
            ['brandFilter', configured.brandNames],
            ['genderFilter', configured.genderFilter]
        ] as const) {
            if (!Array.isArray(source) || !source.length) continue;
            params[target] = params[target] ? `${params[target]},${source.join(',')}` : source.join(',');
        }
        if (['forSale', 'downBuy'].includes(mode)) {
            delete params.activityType;
            delete params.activityStatus;
            delete params.activitySubType;
        }
        if (mode === 'downBuy') params.activityType = 'down_buy';
        return params;
    }

    async function loadActivities(component: CmsNormalizedComponent, currentGeneration: number): Promise<void> {
        const service = input.options().services?.commerce;
        const style = styleOf(component);
        if (!service?.getActivities || !style.activitySessionShow || style.listType !== 'auction') return;
        let result;
        try {
            result = await service.getActivities({
                ...context(component, currentGeneration),
                params: { type: 'auction', status: 'initAndIng', subType: style.subType || '' }
            });
        } catch (cause) {
            throw new CmsError('activities', 'CMS activities failed to load.', cause);
        }
        if (currentGeneration !== generation) return;
        const items = result.items || [];
        const all = items.length
            ? [{ ...items[0], id: '001', squareImage: input.options().assets?.activityAll }, ...items]
            : [];
        activityList.value = all;
        auctionSetParams.value = all[0] || {};
        const requested = input.pageInfo().activityId;
        const selected = requested === undefined ? undefined : all.find(item => item.id === requested);
        if (selected) {
            activityCurrent.value = selected.id;
            auctionSetParams.value = selected;
            goodsParams.value.activityId = selected.id === '001' ? '' : selected.id;
        }
    }

    async function loadFilters(component: CmsNormalizedComponent, currentGeneration: number, mode = '') {
        const service = input.options().services?.commerce;
        const style = styleOf(component);
        if (!service?.getFilters || !(style.filterShow || style.filterShow === 'custom')) return;
        let result;
        try {
            result = await service.getFilters({
                ...context(component, currentGeneration),
                params: buildFilterRequest(component, mode)
            });
        } catch (cause) {
            throw new CmsError('filters', 'CMS filters failed to load.', cause);
        }
        if (currentGeneration === generation) filtersData.value = result || {};
    }

    async function loadGoods(component: CmsNormalizedComponent, currentGeneration: number, append: boolean) {
        const service = input.options().services?.commerce;
        if (!service) throw new CmsError('goods', 'A CMS commerce service is required for goodslist.');
        const request = buildGoodsRequest(component);
        let result;
        try {
            result = await service.getGoods({ ...context(component, currentGeneration), params: request });
        } catch (cause) {
            throw new CmsError('goods', 'CMS goods failed to load.', cause);
        }
        if (currentGeneration !== generation) return;
        const style = styleOf(component);
        if (!append && (result.total || 0) <= 0 && ['forSale', 'downBuy'].includes(style.listMode)) {
            const mode = style.listMode;
            await loadFilters(component, currentGeneration, mode);
            try {
                result = await service.getGoods({
                    ...context(component, currentGeneration),
                    params: buildGoodsRequest(component, mode)
                });
            } catch (cause) {
                throw new CmsError('goods', 'CMS fallback goods failed to load.', cause);
            }
        }
        if (currentGeneration !== generation) return;
        const items = result.items || [];
        goodsList.value = append ? goodsList.value.concat(items) : items;
        const pageSize = Number(style.filterParams?.pageSize || 10);
        const hasMore = result.hasMore ?? items.length >= pageSize;
        if (hasMore) {
            page.value += 1;
            setStatus('ready');
        } else {
            setStatus(goodsList.value.length ? 'no-more' : 'empty');
        }
    }

    function fail(stage: CmsError['stage'], cause: unknown): void {
        const error =
            cause instanceof CmsError
                ? cause
                : new CmsError(stage, cause instanceof Error ? cause.message : String(cause), cause);
        setStatus('error');
        input.onError?.(error);
    }

    async function init(): Promise<void> {
        const component = input.component();
        generation += 1;
        const currentGeneration = generation;
        page.value = 1;
        goodsList.value = [];
        filtersData.value = {};
        activityList.value = [];
        goodsParams.value = {};
        tabsParams.value = {};
        activityCurrent.value = '001';
        tabsCurrent.value = 0;
        if (!component) {
            setStatus('ready');
            return;
        }
        restoreFilters(component);
        busy = true;
        setStatus('initial-loading');
        try {
            await loadActivities(component, currentGeneration);
            await loadFilters(component, currentGeneration);
            await loadGoods(component, currentGeneration, false);
        } catch (cause) {
            if (currentGeneration === generation) fail('goods', cause);
        } finally {
            if (currentGeneration === generation) busy = false;
        }
    }

    async function loadMore(): Promise<void> {
        const component = input.component();
        if (!component || busy || status.value !== 'ready') return;
        const currentGeneration = generation;
        busy = true;
        setStatus('loading-more');
        try {
            await loadGoods(component, currentGeneration, true);
        } catch (cause) {
            if (currentGeneration === generation) fail('goods', cause);
        } finally {
            if (currentGeneration === generation) busy = false;
        }
    }

    async function refresh(): Promise<void> {
        const component = input.component();
        if (!component || busy) return;
        generation += 1;
        const currentGeneration = generation;
        page.value = 1;
        goodsList.value = [];
        busy = true;
        setStatus('initial-loading');
        try {
            await loadFilters(component, currentGeneration);
            await loadGoods(component, currentGeneration, false);
        } catch (cause) {
            if (currentGeneration === generation) fail('goods', cause);
        } finally {
            if (currentGeneration === generation) busy = false;
        }
    }

    async function retry(): Promise<void> {
        await init();
    }

    async function changeActivity(item: Dictionary): Promise<void> {
        if (activityCurrent.value === item.id) return;
        activityCurrent.value = item.id;
        goodsParams.value.activityId = item.id === '001' ? '' : item.id;
        goodsParams.value.activityStatus = item.status || '';
        auctionSetParams.value = item;
        await refresh();
    }

    async function changeTab(index: number, list: Dictionary[]): Promise<void> {
        tabsCurrent.value = index;
        const item = list[index] || {};
        goodsParams.value.categoryId = item.paramType === 'categoryId' || !item.paramType ? item.value || '' : '';
        filterParams.value = {};
        tabsParams.value = item.paramType
            ? { [item.paramType]: item.value }
            : Object.fromEntries((item.customList || []).map((entry: Dictionary) => [entry.customLabel, entry.customValue]));
        await refresh();
    }

    async function confirmFilter(params: Dictionary): Promise<void> {
        const component = input.component();
        filterParams.value = { ...params };
        if (component) persistFilters(component, params);
        await refresh();
    }

    async function navigateGoods(item: Dictionary, index: number): Promise<void> {
        const component = input.component();
        const service = input.options().services?.commerce;
        if (!component || !service?.navigateGoods) return;
        await service.navigateGoods({ ...context(component, generation), item, index });
    }

    function refreshQuotePay(price: unknown, index: number): void {
        const activityInfo = goodsList.value[index]?.activityInfo;
        if (activityInfo && typeof activityInfo === 'object') activityInfo.myPrice = price;
    }

    function invalidate(): void {
        generation += 1;
        busy = false;
    }

    return {
        goodsList,
        filtersData,
        activityList,
        activityCurrent,
        tabsCurrent,
        auctionSetParams,
        status,
        goodsLoadingStatus,
        init,
        loadMore,
        refresh,
        retry,
        changeActivity,
        changeTab,
        confirmFilter,
        navigateGoods,
        refreshQuotePay,
        invalidate
    };
}
