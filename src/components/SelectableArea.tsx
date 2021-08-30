import React from 'react'

import { selectableArea } from '../composers/selectableArea'
import { useSelectableArea } from '../hooks/useSelectableArea'

export interface SelectableAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Leave empty for now
}

export const SelectableArea: React.FC<SelectableAreaProps> = selectableArea(
  ({ className = 'selectable-area', children, ...attributes }) => {
    const { areaRef } = useSelectableArea()

    return (
      <div className={className} {...attributes} ref={areaRef as any}>
        {children}
      </div>
    )
  }
)
