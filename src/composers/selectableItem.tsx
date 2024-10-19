import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { type SelectionEvent, type SelectedItemEvent } from '../events/types'
import { SelectableItemContext } from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { useShallowState } from '../hooks/useShallowState'
import {
  ensureAreaRef,
  ensureItemRef,
  isItemIntersected,
  mergeUnsubFns,
} from '../utils'
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

export function createSelectableItem<P>(
  Comp: React.ComponentType<P>
): React.FC<P & SelectableItemComponentProps> {
  const AnyComp = Comp as any

  return ({ selectableValue, ...props }) => {
    const {
      areaRef,
      events,
      options: { selectionMode, selectionCommands, toggleOnClick },
    } = useSelectableArea()

    const itemId = useMemo(() => ++currentItemId, [])

    const firstItemRender = useRef(true)

    const itemRef = useRef<SelectableElement | null>(null)

    const startSelectionModeRef = useRef(selectionMode)
    const startSelectionEventRef = useRef<SelectionEvent | null>(null)

    const [state, updateState] = useShallowState(() => ({
      selected: false,
      selecting: false,
    }))

    const onSelectionChange = useCallback((e: SelectionEvent) => {
      const $area = ensureAreaRef(areaRef)
      const $item = ensureAreaRef(itemRef)

      updateState({
        selecting: isItemIntersected($area, $item, e.selectionBox),
      })
    }, [])

    const onSelectionStart = useCallback(
      (e: SelectionEvent) => {
        startSelectionEventRef.current = e

        const shiftPressed = e.originalEvent.shiftKey

        if ((shiftPressed || e.originalEvent.altKey) && selectionCommands) {
          startSelectionModeRef.current = shiftPressed ? 'shift' : 'alt'
        }

        onSelectionChange(e)
      },
      [onSelectionChange, selectionCommands]
    )

    const onSelectionEnd = useCallback(
      (e: SelectionEvent) => {
        const $area = ensureAreaRef(areaRef)
        const $item = ensureAreaRef(itemRef)

        const startSelectionMode = startSelectionModeRef.current
        const {
          originalEvent: { target: startTarget },
        } = startSelectionEventRef.current!
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
            ? startSelectionMode === 'alt'
              ? !prevState.selected // Toggle selection on alternate mode
              : !toggleOnClick || getToggleOnClick(prevState.selected)
            : (startSelectionMode === 'shift' ||
                startSelectionMode === 'alt') &&
              prevState.selected,
        }))

        startSelectionEventRef.current = null
        startSelectionModeRef.current = selectionMode
      },
      [selectionMode, toggleOnClick]
    )

    const onSelectAll = useCallback(() => {
      updateState({ selected: true })
    }, [])

    const onDeselectAll = useCallback(() => {
      updateState({ selected: false })
    }, [])

    useEffect(() => {
      if (firstItemRender.current) {
        firstItemRender.current = false
        return
      }

      // Trigger event after re-render
      events.trigger(`${state.selected ? '' : 'de'}selectedItem`, {
        id: itemId,
        value: selectableValue,
        element: itemRef.current!,
      })
    }, [state.selected])

    useEffect(
      () =>
        mergeUnsubFns([
          events.on('selectionStart', onSelectionStart),
          events.on('selectionChange', onSelectionChange),
          events.on('selectionEnd', onSelectionEnd),

          events.on('selectAll', onSelectAll),
          events.on('deselectAll', onDeselectAll),
        ]),
      [selectionMode, selectionCommands, toggleOnClick]
    )

    return (
      <SelectableItemContext.Provider
        value={{
          itemId,
          itemRef,
          ...state,
        }}>
        <AnyComp {...props} />
      </SelectableItemContext.Provider>
    )
  }
}
