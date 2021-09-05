import React, { useRef, useMemo, useEffect } from 'react'

import {
  SelectableAreaContextValue,
  SelectableAreaContext,
  SelectableAreaOptions,
} from '../contexts/SelectableAreaContext'
import { EventEmitter } from '../EventEmitter'
import {
  getRelativeCoordinates,
  guardMouseHandler,
  mergeUnsubFns,
} from '../utils'
import type { SelectionEvent, SelectedItemEvent } from '../EventEmitter'
import type { SelectionBoxObject, MouseEventHandler } from '../sharedTypes'

export interface SelectableAreaComponentProps {
  /**
   *
   */
  options?: SelectableAreaOptions

  /**
   *
   */
  onSelectionStart?: (selection: SelectionEvent) => void

  /**
   *
   */
  onSelectionChange?: (selection: SelectionEvent) => void

  /**
   *
   */
  onSelectionEnd?: (selection: SelectionEvent) => void

  /**
   *
   */
  onSelectedItem?: (selected: SelectedItemEvent) => void

  /**
   *
   */
  onDeselectedItem?: (deselected: SelectedItemEvent) => void
}

const noop = () => {}
const EMPTY_OPTIONS: SelectableAreaOptions = {}

export function selectableArea<P>(
  Comp: React.ComponentType<P>
): React.FC<P & SelectableAreaComponentProps> {
  const AnyComp = Comp as any

  return ({
    options = EMPTY_OPTIONS,
    onSelectionStart = noop,
    onSelectionChange = noop,
    onSelectionEnd = noop,
    onSelectedItem = noop,
    onDeselectedItem = noop,
    ...props
  }) => {
    const { selectionEnabled, ignore } = options

    const areaRef = useRef<HTMLElement | null>(null)
    const startSelectionBoxRef = useRef<SelectionBoxObject | null>(null)
    const selectionBoxRef = useRef<SelectionBoxObject | null>(null)

    const events = useMemo<SelectableAreaContextValue['events']>(
      () => new EventEmitter(),
      []
    )

    useEffect(
      () =>
        mergeUnsubFns([
          events.on('selectedItem', onSelectedItem),
          events.on('deselectedItem', onDeselectedItem),
        ]),
      [onSelectedItem, onDeselectedItem]
    )

    useEffect(() => {
      // Avoid selection
      if (selectionEnabled === false) {
        return
      }

      const $area = areaRef.current!

      const onMouseDown = guardMouseHandler(ignore, (e) => {
        const nextSelectionBox: SelectionBoxObject = {
          ...getRelativeCoordinates($area, e),
          width: 0,
          height: 0,
        }

        startSelectionBoxRef.current = selectionBoxRef.current =
          nextSelectionBox

        const selectionEvent: SelectionEvent = {
          originalEvent: e,
          selectionBox: nextSelectionBox,
        }

        onSelectionStart(selectionEvent)
        events.trigger('selectionStart', selectionEvent)

        $area!.addEventListener('mouseup', onMouseUp)
        $area!.addEventListener('mousemove', onMouseMove)
      })

      const onMouseUp: MouseEventHandler = (e) => {
        const selectionEvent: SelectionEvent = {
          originalEvent: e,
          selectionBox: selectionBoxRef.current!,
        }

        onSelectionEnd(selectionEvent)
        events.trigger('selectionEnd', selectionEvent)
        startSelectionBoxRef.current = selectionBoxRef.current = null

        $area!.removeEventListener('mouseup', onMouseUp)
        $area!.removeEventListener('mousemove', onMouseMove)
      }

      const onMouseMove: MouseEventHandler = (e) => {
        const { current: startSelectionBox } = startSelectionBoxRef
        const { x, y } = getRelativeCoordinates($area, e)

        const nextSelectionBox: SelectionBoxObject = {
          x: Math.min(startSelectionBox!.x, x),
          y: Math.min(startSelectionBox!.y, y),
          width: Math.abs(x - startSelectionBox!.x),
          height: Math.abs(y - startSelectionBox!.y),
        }

        const selectionEvent: SelectionEvent = {
          originalEvent: e,
          selectionBox: nextSelectionBox,
        }

        onSelectionChange(selectionEvent)
        selectionBoxRef.current = nextSelectionBox
        events.trigger('selectionChange', selectionEvent)
      }

      $area!.addEventListener('mousedown', onMouseDown)

      return () => {
        $area!.removeEventListener('mousedown', onMouseDown)
        $area!.removeEventListener('mouseup', onMouseUp)

        // Whether the component is unmount during `mousemove`
        $area!.removeEventListener('mousemove', onMouseMove)
      }
    }, [
      // Options
      selectionEnabled,
      ignore,

      // Events
      onSelectionStart,
      onSelectionChange,
      onSelectionEnd,
    ])

    return (
      <SelectableAreaContext.Provider value={{ areaRef, events, options }}>
        <AnyComp {...props} />
      </SelectableAreaContext.Provider>
    )
  }
}
