import { type SelectionBoxObject } from '../sharedTypes'

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

export type EventEmitterListener<T> = (detail: T) => void
