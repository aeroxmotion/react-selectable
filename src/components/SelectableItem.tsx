import React from 'react'

import { selectableItem } from '../composers/selectableItem'
import { useSelectableItem } from '../hooks/useSelectableItem'
import { SelectableItemContextValue } from '../contexts/SelectableItemContext'
import { useJoinClassNames } from '../utils'

export interface SelectableItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedClassName?: string
  selectingClassName?: string
  children?:
    | React.ReactNode
    | ((item: Omit<SelectableItemContextValue, 'itemRef'>) => void)
}

export const SelectableItem = selectableItem<SelectableItemProps>(
  ({
    className = 'selectable-item',
    selectedClassName = 'selected',
    selectingClassName = 'selecting',
    children,
    ...attributes
  }) => {
    const { itemId, itemRef, selecting, selected } = useSelectableItem()

    return (
      <div
        {...attributes}
        ref={itemRef as any}
        className={useJoinClassNames([
          className,
          selecting && selectingClassName,
          selected && selectedClassName,
        ])}>
        {typeof children === 'function'
          ? children({ itemId, selected, selecting })
          : children}
      </div>
    )
  }
)
