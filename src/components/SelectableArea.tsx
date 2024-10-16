import React, { memo } from 'react'

import type { SelectableAreaContextValue } from '../contexts/SelectableAreaContext'
import { createSelectableArea } from '../composers/selectableArea'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { useJoinClassNames } from '../utils'

export interface SelectableAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tag?: keyof HTMLElementTagNameMap
  selectionEnabledClassName?: string
  children?:
    | React.ReactNode
    | ((area: Omit<SelectableAreaContextValue, 'areaRef'>) => React.ReactNode)
}

const BaseSelectableArea = createSelectableArea<SelectableAreaProps>(
  ({
    tag = 'div',
    className = 'selectable-area',
    selectionEnabledClassName = 'selection-enabled',
    children,
    ...attributes
  }) => {
    const { areaRef, events, options } = useSelectableArea()

    return React.createElement(
      tag,
      {
        ...attributes,
        ref: areaRef,
        className: useJoinClassNames([
          className,
          options.selectionEnabled !== false && selectionEnabledClassName,
        ]),
      },
      typeof children === 'function' ? children({ events, options }) : children
    )
  }
)

export const SelectableArea = memo(BaseSelectableArea)
