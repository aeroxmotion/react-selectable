import React, { useEffect, useMemo, useRef } from 'react'

import type { SelectionEvent, SelectedItemEvent } from '../EventEmitter'
import { SelectableItemContext } from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { useShallowState } from '../hooks/useShallowState'
import { isItemIntersected, mergeUnsubFns } from '../utils'
import type { SelectableElement } from '../sharedTypes'

// TODO: Should be configurable by user's options?
const TOGGLE_ON_CLICK_TRESHOLD = 5

export interface SelectableItemComponentProps {
  /**
   * TODO
   */
  selectableValue?: SelectedItemEvent['value']
}

let currentItemId = 0

export function selectableItem<P>(
  Comp: React.ComponentType<P>
): React.FC<P & SelectableItemComponentProps> {
  const AnyComp = Comp as any

  return ({ selectableValue, ...props }) => {
    const { areaRef, events, options } = useSelectableArea()

    const itemId = useMemo(() => ++currentItemId, [])

    const firstItemRender = useRef(true)
    const itemRef = useRef<SelectableElement | null>(null)

    const [state, updateState] = useShallowState(() => ({
      selected: false,
      selecting: false,
    }))

    useEffect(() => {
      if (firstItemRender.current) {
        firstItemRender.current = false
        return
      }

      // Trigger event after re-render
      events.trigger(`${state.selected ? '' : 'de'}selectedItem`, {
        id: itemId,
        element: itemRef.current!,
        value: selectableValue,
      })
    }, [state.selected])

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
}
