/// <reference types="vite/client" />

export {}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  interface Uni {
    $snake: typeof import('./uni_modules/snake-ui/libs').snake
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $snake: typeof import('./uni_modules/snake-ui/libs').snake
    $themeStyle: Record<string, string>
  }
}
