import type { Component } from 'vue';
import ButtonShowcase from './showcases/foundation/ButtonShowcase.vue';

const showcaseRegistry: Record<string, Component> = {
    button: ButtonShowcase
};

export function resolveShowcase(kind: string): Component | undefined {
    return showcaseRegistry[kind];
}

export const registeredShowcaseKinds = Object.freeze(Object.keys(showcaseRegistry));
