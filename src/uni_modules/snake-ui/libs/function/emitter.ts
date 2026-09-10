export type EventHandler<Payload = unknown> = (payload: Payload) => void;

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

export const emitter = createEmitter();
