import React, { memo } from 'react'

import type { SelectableItemContextValue } from '../contexts/SelectableItemContext'
import { createSelectableItem } from '../composers/selectableItem'
import { useSelectableItem } from '../hooks/useSelectableItem'
import { useJoinClassNames } from '../utils'

export type SelectableItemClassNames = {
  /**
   * CSS class applied when the item is selected.
   */
  selected?: string

  /**
   * CSS class applied when the item is being hovered.
   */
  selecting?: string
}

export interface SelectableItemProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Custom tag (defaults to `div`).
   */
  tag?: keyof HTMLElementTagNameMap

  /**
   * CSS classes.
   */
  classNames?: SelectableItemClassNames

  /**
   * Allows to pass a custom render function to access current `SelectableItem`'s context.
   *
   * ```ts
   * <SelectableItem>
   *   {({ selecting, selected }) => (
   *     <>
   *       {selecting && <p>Selecting</p>}
   *       {selecting && <p>De-select all</p>}
   *     </>
   *   )}
   * </SelectableItem>
   * ```
   */
  children?:
    | React.ReactNode
    | ((item: Omit<SelectableItemContextValue, 'itemRef'>) => React.ReactNode)
}

const DEFAULT_SELECTABLE_ITEM_CLASS_NAMES: Required<SelectableItemClassNames> =
  {
    selected: 'selected',
    selecting: 'selecting',
  }

const BaseSelectableItem = createSelectableItem<SelectableItemProps>(
  ({
    tag = 'div',
    className = 'selectable-item',
    classNames = DEFAULT_SELECTABLE_ITEM_CLASS_NAMES,
    children,
    ...attributes
  }) => {
    const { selectableID, itemRef, selecting, selected } = useSelectableItem()

    return React.createElement(
      tag,
      {
        ...attributes,
        ref: itemRef,
        className: useJoinClassNames([
          className,
          selecting && classNames.selecting,
          selected && classNames.selected,
        ]),
      },
      typeof children === 'function'
        ? children({ selectableID, selected, selecting })
        : children
    )
  }
)

export const SelectableItem = memo(BaseSelectableItem)
