import { createContext } from 'react'

import type { EventEmitter } from '../EventEmitter'

export type SelectableElement = HTMLElement | SVGElement

export interface SelectableEvents {
  /**
   *
   */
  selectionStart: SelectionBoxObject

  /**
   *
   */
  selectionChange: SelectionBoxObject

  /**
   *
   */
  selectionEnd: SelectionBoxObject

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
   * TODO
   */
  selectionEnabled?: boolean

  /**
   * TODO
   */
  shiftMode?: boolean
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
