import type { InjectionKey, Ref } from 'vue';
export interface DropMenuContext {
    activeItem: Ref<symbol | null>;
    highlighted: Ref<number | undefined>;
    menuTop: Ref<number>;
    activeColor: Ref<string>;
    inactiveColor: Ref<string>;
    titleSize: Ref<string | number | null | undefined>;
    menuIcon: Ref<string>;
    menuIconSize: Ref<string | number | null | undefined>;
    duration: Ref<number>;
    closeOnClickMask: Ref<boolean>;
    closeOnClickSelf: Ref<boolean>;
    zIndex: Ref<number>;
    register(item: symbol): number;
    unregister(item: symbol): void;
    indexOf(item: symbol): number;
    open(item: symbol): void;
    close(): void;
    updateRect(): Promise<void>;
}
export const dropMenuKey: InjectionKey<DropMenuContext> = Symbol('snake-drop-menu');
