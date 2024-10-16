import React, { memo } from 'react'

import { useSelectionBox } from '../hooks/useSelectionBox'

export interface SelectionBoxProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Custom tag (defaults to `div`)
   */
  tag?: keyof HTMLElementTagNameMap

  /**
   * Prefix for CSS custom properties to style your selection box.
   * Defaults to `selection-box`.
   *
   * __Note:__ Instead of styling the selection box's element directly,
   * we just use custom properties to hold the current state
   * of the selection box, so you can style it as you want.
   */
  customPropertyPrefix?: string
}

const BaseSelectionBox: React.FC<SelectionBoxProps> = ({
  tag = 'div',
  className = 'selection-box',
  customPropertyPrefix = 'selection-box',
  ...attributes
}) => {
  const selectionBox = useSelectionBox()

  // If no selection box, just remove it from the DOM
  if (!selectionBox) {
    return null
  }

  return React.createElement(tag, {
    ...attributes,
    className,
    style: {
      [`--${customPropertyPrefix}-x`]: `${selectionBox.x}px`,
      [`--${customPropertyPrefix}-y`]: `${selectionBox.y}px`,
      [`--${customPropertyPrefix}-width`]: `${selectionBox.width}px`,
      [`--${customPropertyPrefix}-height`]: `${selectionBox.height}px`,
      ...attributes.style,
    },
  })
}

export const SelectionBox = memo(BaseSelectionBox)
