import type { Component } from 'vue';
import ButtonShowcase from './showcases/foundation/ButtonShowcase.vue';
import IconShowcase from './showcases/foundation/IconShowcase.vue';
import MediaShowcase from './showcases/foundation/MediaShowcase.vue';

const showcaseRegistry: Record<string, Component> = {
    button: ButtonShowcase,
    icon: IconShowcase,
    image: MediaShowcase,
    'lazy-image': MediaShowcase
};

export function resolveShowcase(kind: string): Component | undefined {
    return showcaseRegistry[kind];
}

export const registeredShowcaseKinds = Object.freeze(Object.keys(showcaseRegistry));
