import React, { useCallback, useEffect, useRef } from 'react'

import { useStateRef } from '../hooks/useStateRef'
import { type SelectionEvent } from '../events/types'
import { useShallowState } from '../hooks/useShallowState'
import { isItemIntersected, mergeUnsubFns } from '../utils'
import { useSelectableArea } from '../hooks/useSelectableArea'
import { SelectableItemContext } from '../contexts/SelectableItemContext'
import { type SelectableElement, type SelectableID } from '../sharedTypes'

// TODO: Should be configurable by user's options?
const TOGGLE_ON_CLICK_TRESHOLD = 5

export interface SelectableItemComponentProps {
  /**
   * Optional custom ID
   */
  selectableID?: SelectableID
}

export function createSelectableItem<P>(
  Comp: React.ComponentType<P>
): React.FC<P & SelectableItemComponentProps> {
  const AnyComp = Comp as any

  return ({ selectableID = crypto.randomUUID(), ...props }) => {
    const {
      areaRef,
      events,
      options: { selectionMode, selectionCommands, toggleOnClick },
    } = useSelectableArea()

    const firstItemRender = useRef(true)

    const itemRef = useStateRef<SelectableElement | null>(null)

    const startSelectionModeRef = useRef(selectionMode)
    const startSelectionEventRef = useRef<SelectionEvent | null>(null)

    const [state, updateState] = useShallowState(() => ({
      selected: false,
      selecting: false,
    }))

    const onSelectionChange = useCallback(
      (e: SelectionEvent) => {
        updateState({
          selecting: isItemIntersected(
            areaRef.current!,
            itemRef.current!,
            e.selectionBox
          ),
        })
      },
      [areaRef.current, itemRef.current]
    )

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
        const $item = itemRef.current!

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
          selected: isItemIntersected(areaRef.current!, $item, e.selectionBox)
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
      [areaRef.current, itemRef.current, selectionMode, toggleOnClick]
    )

    const selectItem = useCallback(() => {
      updateState({ selected: true })
    }, [])

    const deselectItem = useCallback(() => {
      updateState({ selected: false })
    }, [])

    useEffect(() => {
      if (firstItemRender.current) {
        firstItemRender.current = false
        return
      }

      // Trigger event after re-render
      events.trigger(`${state.selected ? '' : 'de'}selectedItem`, {
        id: selectableID,
        element: itemRef.current!,
      })
    }, [state.selected])

    useEffect(
      () =>
        mergeUnsubFns([
          events.on('selectionStart', onSelectionStart),
          events.on('selectionChange', onSelectionChange),
          events.on('selectionEnd', onSelectionEnd),

          events.on('selectAll', selectItem),
          events.on('deselectAll', deselectItem),
          events.on(`select:${selectableID}`, selectItem),
          events.on(`deselect:${selectableID}`, deselectItem),
        ]),
      [
        selectItem,
        deselectItem,
        onSelectionStart,
        onSelectionChange,
        onSelectionEnd,
      ]
    )

    return (
      <SelectableItemContext.Provider
        value={{
          itemRef,
          selectableID,
          ...state,
        }}>
        <AnyComp {...props} />
      </SelectableItemContext.Provider>
    )
  }
}
