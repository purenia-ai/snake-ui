export type SnakeEventHandler<Payload = unknown> = (payload: Payload) => void;

export function createSnakeEmitter() {
    const events = new Map<string, Set<SnakeEventHandler>>();
    return {
        on<Payload>(name: string, handler: SnakeEventHandler<Payload>) {
            const handlers = events.get(name) || new Set();
            handlers.add(handler as SnakeEventHandler);
            events.set(name, handlers);
            return () => handlers.delete(handler as SnakeEventHandler);
        },
        off<Payload>(name: string, handler?: SnakeEventHandler<Payload>) {
            if (!handler) events.delete(name);
            else events.get(name)?.delete(handler as SnakeEventHandler);
        },
        emit<Payload>(name: string, payload: Payload) {
            events.get(name)?.forEach(handler => handler(payload));
        },
        clear() {
            events.clear();
        }
    };
}

export const snakeEmitter = createSnakeEmitter();
