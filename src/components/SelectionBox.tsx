import React from 'react'

import { useSelectionBox } from '../hooks/useSelectionBox'

export interface SelectionBoxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Leave empty for now
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  className = 'selection-box',
  ...attributes
}) => {
  const selectionBox = useSelectionBox()

  return (
    selectionBox && (
      <div
        {...attributes}
        className={className}
        style={{
          top: selectionBox.y,
          left: selectionBox.x,
          width: selectionBox.width,
          height: selectionBox.height,
          ...attributes.style,
        }}
      />
    )
  )
}
