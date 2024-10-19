import { type SelectionBoxObject } from '../sharedTypes'

export type EventMapping = {
  [eventName: string]: any
}

export interface SelectionEvent {
  /**
   * Original `mouse`'s event
   */
  readonly originalEvent: MouseEvent

  /**
   * Current selection's box data
   */
  readonly selectionBox: SelectionBoxObject
}

export interface SelectedItemEvent {
  /**
   *
   */
  readonly id: number

  /**
   *
   */
  readonly element: Element

  /**
   *
   */
  readonly value: any
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
