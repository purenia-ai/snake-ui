/**
 * 延时等待：把 setTimeout 包成 Promise，用 `await sleep(ms)` 让逻辑按节奏暂停。
 * @param delay 等待时长，单位 ms，默认 0
 */
export function sleep(delay = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
}
