export type EventMapping = {
  [eventName: string]: any
}

export class EventEmitter<T extends EventMapping> extends EventTarget {
  on<K extends keyof T>(
    eventName: K,
    listener: (event: CustomEvent<T[K]>) => void
  ) {
    super.addEventListener(eventName as string, listener as any)

    return () => super.removeEventListener(eventName as string, listener as any)
  }

  trigger<K extends keyof T>(eventName: K, detail?: T[K]) {
    super.dispatchEvent(new CustomEvent(eventName as string, { detail }))
  }
}
