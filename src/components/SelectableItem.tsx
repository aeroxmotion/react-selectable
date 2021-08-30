import React from 'react'

import { selectableItem } from '../composers/selectableItem'
import { useSelectableItem } from '../hooks/useSelectableItem'
import { SelectableItemContextValue } from '../contexts/SelectableItemContext'

export interface SelectableItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedClassName?: string
  selectingClassName?: string
  children?:
    | React.ReactNode
    | ((item: Omit<SelectableItemContextValue, 'itemRef'>) => void)
  // Leave empty for now
}

export const SelectableItem: React.FC<SelectableItemProps> = selectableItem(
  ({
    className = 'selectable-item',
    selectedClassName = 'selected',
    selectingClassName = 'selecting',
    children,
    ...attributes
  }) => {
    const { itemRef, selecting, selected } = useSelectableItem()
    const classNames = [
      className,
      selecting && selectingClassName,
      selected && selectedClassName,
    ]

    return (
      <div
        {...attributes}
        ref={itemRef as any}
        className={classNames.filter(Boolean).join(' ')}>
        {typeof children === 'function'
          ? children({ selected, selecting })
          : children}
      </div>
    )
  }
)
