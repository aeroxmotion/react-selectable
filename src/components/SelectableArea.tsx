import React from 'react'

import { selectableArea } from '../composers/selectableArea'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { useJoinClassNames } from '../utils'

export interface SelectableAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectionEnabledClassName?: string
}

export const SelectableArea = selectableArea<SelectableAreaProps>(
  ({
    className = 'selectable-area',
    selectionEnabledClassName = 'selection-enabled',
    children,
    ...attributes
  }) => {
    const { areaRef, options } = useSelectableArea()

    return (
      <div
        {...attributes}
        ref={areaRef as any}
        className={useJoinClassNames([
          className,
          options.selectionEnabled !== false && selectionEnabledClassName,
        ])}>
        {children}
      </div>
    )
  }
)
