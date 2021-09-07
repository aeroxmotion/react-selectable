import { createContext } from 'react'

import type { SelectableEventEmitter } from '../EventEmitter'
import type { SelectableElement } from '../sharedTypes'

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
   * 'alt': Alternate between already selected items
   * 'default' (no value): Only persists selected items from the last selection
   */
  selectionMode?: 'shift' | 'alt'

  /**
   * Switch between selection mode's by using
   * `shift` key to switch up to shift's selection mode and
   * `alt` key to switch up to alt's selection mode while
   * selecting items
   */
  selectionCommands?: boolean

  /**
   * Set of CSS selectors to ignore elements on `mousedown`
   */
  ignore?: string[]
}

export interface SelectableAreaContextValue {
  /**
   * Selectable area's ref container
   */
  readonly areaRef: React.MutableRefObject<SelectableElement | null>

  /**
   * Events manager
   */
  readonly events: SelectableEventEmitter

  /**
   * Passed options to `SelectableArea`'s component
   */
  readonly options: SelectableAreaOptions
}

export const SelectableAreaContext = createContext<SelectableAreaContextValue>(
  // Should throw an error when missing context
  null as any
)
