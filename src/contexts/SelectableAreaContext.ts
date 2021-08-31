import { createContext } from 'react'

import type { EventEmitter } from '../EventEmitter'

export type SelectableElement = HTMLElement | SVGElement

export type SelectionEvent = {
  originalEvent: MouseEvent
  selectionBox: SelectionBoxObject
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
}

export interface SelectionBoxObject {
  /**
   * x-position in px relative to `SelectableArea`'s container
   */
  readonly x: number

  /**
   * y-position in px relative to `SelectableArea`'s container
   */
  readonly y: number

  /**
   * Box width in px
   */
  readonly width: number

  /**
   * Box height in px
   */
  readonly height: number
}

export interface SelectableAreaOptions {
  /**
   * Toggle `selected` item. Useful in conjunction
   * with shift's selection mode
   */
  toggleOnClick?: boolean

  /**
   * When `true` selection is enabled
   */
  selectionEnabled?: boolean

  /**
   * Selection mode.
   *
   * 'shift': Add selected items on new selections
   * 'default' (no value): Only persists selected items from the last selection
   */
  selectionMode?: 'shift'

  /**
   * Set of CSS selectors to ignore elements from selection
   */
  ignoreMouseEvents?: string[]
}

export interface SelectableAreaContextValue {
  /**
   * Selectable area's ref container
   */
  readonly areaRef: React.MutableRefObject<HTMLElement | null>

  /**
   * Events manager
   */
  readonly events: EventEmitter<SelectableEvents>

  /**
   * TODO
   */
  readonly options: SelectableAreaOptions
}

export const SelectableAreaContext = createContext<SelectableAreaContextValue>(
  // Should throw an error when missing context
  null as any
)
