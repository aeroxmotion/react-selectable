import React, { useEffect, useRef } from 'react'

import type { SelectionBoxObject } from '../contexts/SelectableAreaContext'
import {
  SelectableItemContext,
  SelectableItemContextValue,
} from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { isItemIntersected, useShallowState } from '../utils'

export type SelectableItemState = Omit<SelectableItemContextValue, 'itemRef'>

export function selectableItem<T extends React.FC<any>>(Comp: T): T {
  const AnyComp = Comp as any

  const Result: React.FC<any> = ({ ...props }) => {
    const { areaRef, events, options } = useSelectableArea()

    const itemRef = useRef<Element | null>(null)

    const [state, updateState] = useShallowState<SelectableItemState>(() => ({
      selected: false,
      selecting: false,
    }))

    useEffect(() => {
      const $area = areaRef.current!
      const $item = itemRef.current!

      const onSelecting = (e: CustomEvent<SelectionBoxObject>) => {
        updateState({
          selecting: isItemIntersected($area, $item, e.detail),
        })
      }

      const onSelected = (e: CustomEvent<SelectionBoxObject>) => {
        updateState((prevState) => ({
          selecting: false,
          selected:
            isItemIntersected($area, $item, e.detail) ||
            (!!options.shiftMode && prevState.selected),
        }))
      }

      const onSelectAll = () => {
        updateState({ selected: true })
      }

      const onDeselectAll = () => {
        updateState({ selected: false })
      }

      const unsubs = [
        events.on('selectionStart', onSelecting),
        events.on('selectionChange', onSelecting),
        events.on('selectionEnd', onSelected),

        events.on('selectAll', onSelectAll),
        events.on('deselectAll', onDeselectAll),
      ]

      return () => {
        for (const unsub of unsubs) {
          unsub()
        }
      }
    }, [options.shiftMode])

    return (
      <SelectableItemContext.Provider
        value={{
          itemRef,
          ...state,
        }}>
        <AnyComp {...props} />
      </SelectableItemContext.Provider>
    )
  }

  return Result as T
}
