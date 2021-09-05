import { createContext } from 'react'

import type { SelectableElement } from '../sharedTypes'

export interface SelectableItemContextValue {
  /**
   * Selectable item's ref container
   */
  readonly itemRef: React.MutableRefObject<SelectableElement | null>

  /**
   * `true` when the item is selected
   */
  readonly selected: boolean

  /**
   * `true` when the item is being selected
   */
  readonly selecting: boolean
}

export const SelectableItemContext = createContext<SelectableItemContextValue>(
  // Should throw an error when missing context
  null as any
)
