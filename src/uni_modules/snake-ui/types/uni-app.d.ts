import type { FoundationAPI } from '../libs/foundation';

/**
 * $snake 的全局类型。
 *
 * 以可增强 interface 开放：宿主向运行时 $snake 挂载业务工具（Object.assign 等）时，
 * 通过 `declare module '@puresnake/snake-ui/types/uni-app'` 向本接口补充成员即可，
 * 不要在宿主侧重复声明 `Uni.$snake`——同名属性的不同类型会在接口合并时冲突，
 * 报错被 skipLibCheck 压掉后，$snake 的类型会随文件加载顺序漂移。
 */
export interface SnakeGlobalAPI extends FoundationAPI {}

declare global {
    interface Uni {
        $snake: SnakeGlobalAPI;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $snake: SnakeGlobalAPI;
        $themeStyle: Readonly<Record<string, string>>;
    }
}
