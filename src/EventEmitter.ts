export type EventMapping = {
  [eventName: string]: any
}

export class EventEmitter<T extends EventMapping> extends Map<
  keyof T,
  Set<(event: T[keyof T]) => void>
> {
  on<K extends keyof T>(eventName: K, listener: (event: T[K]) => void) {
    const listeners = super.get(eventName) ?? new Set()

    listeners.add(listener as any)
    super.set(eventName, listeners)

    return () => {
      listeners.delete(listener as any)

      if (!listeners.size) {
        super.delete(eventName)
      }
    }
  }

  trigger<K extends keyof T>(eventName: K, detail?: T[K]) {
    const listeners = super.get(eventName)

    if (listeners) {
      for (const listener of listeners) {
        listener(detail!)
      }
    }
  }
}
