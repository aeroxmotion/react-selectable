import { createContext } from 'react'

import { type SelectableEventEmitter } from '../events/EventEmitter'
import { type SelectableElement } from '../sharedTypes'

/**
 * Returns `true` whether the given mouse `event`
 * should be ignored, `false` otherwise.
 */
export type IgnoreHandler = (event: MouseEvent) => boolean

export interface SelectableAreaOptions {
  /**
   * Toggle `selected` item. Useful in conjunction
   * with shift's selection mode
   */
  readonly toggleOnClick?: boolean

  /**
   * When `true` selection is enabled
   */
  readonly selectionEnabled?: boolean

  /**
   * Selection mode.
   *
   *  - `shift`: Add selected items on new selections
   *  - `alt`: De-select on already selected items
   *  - `default` (no value): Only persists selected items from the last selection
   */
  readonly selectionMode?: 'shift' | 'alt'

  /**
   * Switch between selection mode's by using
   * `shift` key to switch up to shift's selection mode and
   * `alt` key to switch up to alt's selection mode while
   * selecting items
   */
  readonly selectionCommands?: boolean

  /**
   * Set of CSS selectors or handlers to ignore elements on `mousedown`
   */
  readonly ignore?: (string | IgnoreHandler)[]
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
