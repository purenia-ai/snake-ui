import type { Component } from 'vue';
import ButtonShowcase from './showcases/foundation/ButtonShowcase.vue';
import IconShowcase from './showcases/foundation/IconShowcase.vue';

const showcaseRegistry: Record<string, Component> = {
    button: ButtonShowcase,
    icon: IconShowcase
};

export function resolveShowcase(kind: string): Component | undefined {
    return showcaseRegistry[kind];
}

export const registeredShowcaseKinds = Object.freeze(Object.keys(showcaseRegistry));
