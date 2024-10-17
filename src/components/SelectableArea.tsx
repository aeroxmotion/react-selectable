import React, { memo } from 'react'

import { type SelectableAreaContextValue } from '../contexts/SelectableAreaContext'
import { createSelectableArea } from '../composers/selectableArea'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { useJoinClassNames } from '../utils'

export interface SelectableAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom tag (defaults to `div`).
   */
  tag?: keyof HTMLElementTagNameMap

  /**
   * CSS classes to apply when selection is enabled.
   */
  selectionEnabledClassName?: string

  /**
   * Allows to pass a custom render function to access current `SelectableArea`'s context.
   *
   * ```ts
   * <SelectableArea>
   *   {({ selectAll, deselectAll }) => (
   *     <>
   *       <button onClick={selectAll}>Select all</button>
   *       <button onClick={deselectAll}>De-select all</button>
   *     </>
   *   )}
   * </SelectableArea>
   * ```
   */
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
    const { areaRef, events, options, ...imperativeMethods } =
      useSelectableArea()

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
      typeof children === 'function'
        ? children({ events, options, ...imperativeMethods })
        : children
    )
  }
)

export const SelectableArea = memo(BaseSelectableArea)
