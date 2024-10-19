import { type MutableRefObject, createContext } from 'react'

import { type SelectableEventEmitter } from '../events/EventEmitter'
import { type SelectableID, type SelectableElement } from '../sharedTypes'

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
  toggleOnClick?: boolean

  /**
   * When `true` selection is enabled
   */
  selectionEnabled?: boolean

  /**
   * Selection mode.
   *
   *  - `shift`: Add selected items on new selections
   *  - `alt`: De-select on already selected items
   *  - `default` (no value): Only persists selected items from the last selection
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
   * Set of CSS selectors or handlers to ignore elements on `mousedown`
   */
  ignore?: (string | IgnoreHandler)[]
}

export interface SelectableAreaImperativeMethods {
  /**
   * Performs selection from a given item's id.
   *
   * An alias for `events.trigger('select:<id>')`
   */
  readonly select: (id: SelectableID) => void

  /**
   * Performs de-selection from a given item's id.
   *
   * An alias for `events.trigger('deselect:<id>')`
   */
  readonly deselect: (id: SelectableID) => void

  /**
   * Performs selection from all `SelectableArea`'s items.
   *
   * An alias for `events.trigger('selectAll')`
   */
  readonly selectAll: () => void

  /**
   * Performs de-selection from all `SelectableArea`'s items.
   *
   * An alias for `events.trigger('deselectAll')`
   */
  readonly deselectAll: () => void
}

export interface SelectableAreaContextValue
  extends SelectableAreaImperativeMethods {
  /**
   * Selectable area's ref container
   */
  readonly areaRef: MutableRefObject<SelectableElement | null>

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
