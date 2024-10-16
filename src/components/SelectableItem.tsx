import React, { memo } from 'react'

import type { SelectableItemContextValue } from '../contexts/SelectableItemContext'
import { createSelectableItem } from '../composers/selectableItem'
import { useSelectableItem } from '../hooks/useSelectableItem'
import { useJoinClassNames } from '../utils'

export interface SelectableItemProps extends React.HTMLAttributes<HTMLElement> {
  tag?: keyof HTMLElementTagNameMap
  selectedClassName?: string
  selectingClassName?: string
  children?:
    | React.ReactNode
    | ((item: Omit<SelectableItemContextValue, 'itemRef'>) => React.ReactNode)
}

const BaseSelectableItem = createSelectableItem<SelectableItemProps>(
  ({
    tag = 'div',
    className = 'selectable-item',
    selectedClassName = 'selected',
    selectingClassName = 'selecting',
    children,
    ...attributes
  }) => {
    const { itemId, itemRef, selecting, selected } = useSelectableItem()

    return React.createElement(
      tag,
      {
        ...attributes,
        ref: itemRef,
        className: useJoinClassNames([
          className,
          selecting && selectingClassName,
          selected && selectedClassName,
        ]),
      },
      typeof children === 'function'
        ? children({ itemId, selected, selecting })
        : children
    )
  }
)

export const SelectableItem = memo(BaseSelectableItem)
