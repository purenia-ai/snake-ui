export type EventHandler<Payload = unknown> = (payload: Payload) => void;

/**
 * 轻量事件总线：同一 handler 用 Set 去重，on 返回解绑函数，
 * off 不传 handler 时清空整个事件，clear() 清空全部事件。
 */
export function createEmitter() {
    const events = new Map<string, Set<EventHandler>>();
    return {
        on<Payload>(name: string, handler: EventHandler<Payload>) {
            const handlers = events.get(name) || new Set();
            handlers.add(handler as EventHandler);
            events.set(name, handlers);
            return () => handlers.delete(handler as EventHandler);
        },
        off<Payload>(name: string, handler?: EventHandler<Payload>) {
            if (!handler) events.delete(name);
            else events.get(name)?.delete(handler as EventHandler);
        },
        emit<Payload>(name: string, payload: Payload) {
            events.get(name)?.forEach(handler => handler(payload));
        },
        clear() {
            events.clear();
        }
    };
}

/** 库内共享的事件总线单例。 */
export const emitter = createEmitter();
