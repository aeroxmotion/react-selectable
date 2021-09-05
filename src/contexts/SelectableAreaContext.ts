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
   * 'default' (no value): Only persists selected items from the last selection
   */
  selectionMode?: 'shift'

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
