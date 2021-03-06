import type { SelectionBoxObject } from './sharedTypes'

export type EventMapping = {
  [eventName: string]: any
}

export type SelectionEvent = {
  /**
   *
   */
  originalEvent: MouseEvent

  /**
   *
   */
  selectionBox: SelectionBoxObject
}

export type SelectedItemEvent = {
  /**
   *
   */
  id: number

  /**
   *
   */
  element: Element

  /**
   *
   */
  value: any
}

export interface SelectableEvents {
  /**
   *
   */
  selectionStart: SelectionEvent

  /**
   *
   */
  selectionChange: SelectionEvent

  /**
   *
   */
  selectionEnd: SelectionEvent

  /**
   *
   */
  selectAll: void

  /**
   *
   */
  deselectAll: void

  /**
   *
   */
  selectedItem: SelectedItemEvent

  /**
   *
   */
  deselectedItem: SelectedItemEvent
}

export type SelectableEventEmitter = EventEmitter<SelectableEvents>

export class EventEmitter<T extends EventMapping> extends Map<
  keyof T,
  Set<(event: T[keyof T]) => void>
> {
  on<K extends keyof T>(eventName: K, listener: (event: T[K]) => void) {
    let listeners = super.get(eventName)

    if (!listeners) {
      super.set(eventName, (listeners = new Set()))
    }

    listeners.add(listener as any)

    return () => {
      listeners!.delete(listener as any)

      if (!listeners!.size) {
        super.delete(eventName)
      }
    }
  }

  trigger<K extends keyof T>(eventName: K, detail?: T[K]) {
    const listeners = super.get(eventName)

    if (listeners) {
      listeners.forEach((listener) => listener(detail!))
    }
  }
}
