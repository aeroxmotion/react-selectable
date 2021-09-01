import React, { useEffect, useRef } from 'react'

import type { SelectionEvent } from '../contexts/SelectableAreaContext'
import { SelectableItemContext } from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { isItemIntersected, mergeUnsubFns, useShallowState } from '../utils'

// TODO: Should be configurable by user's options?
const TOGGLE_ON_CLICK_TRESHOLD = 5

export function selectableItem<T extends React.FC<any>>(Comp: T): T {
  const AnyComp = Comp as any

  const Result: React.FC<any> = ({ ...props }) => {
    const { areaRef, events, options } = useSelectableArea()

    const itemRef = useRef<Element | null>(null)

    const [state, updateState] = useShallowState(() => ({
      selected: false,
      selecting: false,
    }))

    useEffect(() => {
      const $area = areaRef.current!
      const $item = itemRef.current!

      let selectionStartEvent: SelectionEvent | null = null

      const onSelectionStart = (e: SelectionEvent) => {
        selectionStartEvent = e
        onSelecting(e)
      }

      const onSelecting = (e: SelectionEvent) => {
        updateState({
          selecting: isItemIntersected($area, $item, e.selectionBox),
        })
      }

      const onSelected = (e: SelectionEvent) => {
        const {
          originalEvent: { target: startTarget },
        } = selectionStartEvent!
        const {
          originalEvent: { target: endTarget },
          selectionBox: endSelectionBox,
        } = e

        const getToggleOnClick = (prevSelected: boolean) =>
          // Check for start selection target
          ($item === startTarget || $item.contains(startTarget as any)) &&
          // Check for end selection target
          ($item === endTarget || $item.contains(endTarget as any)) &&
          endSelectionBox.width <= TOGGLE_ON_CLICK_TRESHOLD &&
          endSelectionBox.height <= TOGGLE_ON_CLICK_TRESHOLD
            ? !prevSelected
            : true

        updateState((prevState) => ({
          selecting: false,
          selected: isItemIntersected($area, $item, e.selectionBox)
            ? !options.toggleOnClick || getToggleOnClick(prevState.selected)
            : options.selectionMode === 'shift' && prevState.selected,
        }))

        selectionStartEvent = null
      }

      const onSelectAll = () => {
        updateState({ selected: true })
      }

      const onDeselectAll = () => {
        updateState({ selected: false })
      }

      return mergeUnsubFns([
        events.on('selectionStart', onSelectionStart),
        events.on('selectionChange', onSelecting),
        events.on('selectionEnd', onSelected),

        events.on('selectAll', onSelectAll),
        events.on('deselectAll', onDeselectAll),
      ])
    }, [options.selectionMode, options.toggleOnClick])

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
