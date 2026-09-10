type GlobalAPI = typeof import('../libs/foundation').snake;

declare global {
    interface Uni {
        $snake: GlobalAPI;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $snake: GlobalAPI;
        $themeStyle: Readonly<Record<string, string>>;
    }
}

export {};
