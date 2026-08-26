type SnakeGlobalAPI = typeof import('../libs/foundation').snake;

declare global {
    interface Uni {
        $snake: SnakeGlobalAPI;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $snake: SnakeGlobalAPI;
        $snakeThemeStyle: Readonly<Record<string, string>>;
    }
}

export {};
