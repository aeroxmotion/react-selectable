import React, { useEffect, useRef, useState } from 'react'

import type { SelectionBoxObject } from '../contexts/SelectableAreaContext'
import {
  SelectableItemContext,
  SelectableItemContextValue,
} from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'

export type SelectableItemState = Omit<SelectableItemContextValue, 'itemRef'>

// Internal type
type PartialState = Partial<SelectableItemState>

export function selectableItem<T extends React.FC<any>>(Comp: T): T {
  const AnyComp = Comp as any

  const Result: React.FC<any> = ({ ...props }) => {
    const { areaRef, events, options } = useSelectableArea()

    const itemRef = useRef<Element | null>(null)

    const [state, setState] = useState<SelectableItemState>(() => ({
      selected: false,
      selecting: false,
    }))

    const updateState = (
      nextState:
        | PartialState
        | ((prevState: SelectableItemState) => PartialState)
    ) => {
      setState((prevState) => {
        const nextStateObj =
          typeof nextState === 'function' ? nextState(prevState) : nextState

        const keys: Array<keyof SelectableItemState> = Object.keys(
          nextStateObj
        ) as any

        for (const key of keys) {
          if (prevState[key] !== nextStateObj[key]) {
            return {
              ...prevState,
              ...nextStateObj,
            }
          }
        }

        return prevState
      })
    }

    const isItemIntersected = (selectionBox: SelectionBoxObject) => {
      const { current: $item } = itemRef

      const itemRect = $item!.getBoundingClientRect()
      const areaRect = areaRef.current!.getBoundingClientRect()

      const itemCoordinates = {
        x: itemRect.x - areaRect.x,
        y: itemRect.y - areaRect.y,
      }

      if (itemCoordinates.x + itemRect.width < selectionBox.x) {
        return false
      }

      if (itemCoordinates.x > selectionBox.x + selectionBox.width) {
        return false
      }

      if (itemCoordinates.y + itemRect.height < selectionBox.y) {
        return false
      }

      if (itemCoordinates.y > selectionBox.y + selectionBox.height) {
        return false
      }

      return true
    }

    useEffect(() => {
      const onSelecting = (e: CustomEvent<SelectionBoxObject>) => {
        updateState({
          selecting: isItemIntersected(e.detail),
        })
      }

      const onSelected = (e: CustomEvent<SelectionBoxObject>) => {
        updateState((prevState) => ({
          selecting: false,
          selected:
            isItemIntersected(e.detail) ||
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
