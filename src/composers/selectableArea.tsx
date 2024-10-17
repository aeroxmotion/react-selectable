import React, {
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'

import {
  SelectableAreaContext,
  type SelectableAreaOptions,
  type SelectableAreaContextValue,
  type SelectableAreaImperativeMethods,
} from '../contexts/SelectableAreaContext'
import { EventEmitter } from '../events/EventEmitter'
import { type SelectionEvent, type SelectedItemEvent } from '../events/types'
import {
  EMPTY_OBJECT,
  getRelativeCoordinatesToArea,
  guardMouseHandler,
  mergeUnsubFns,
  NOOP,
  ensureAreaRef,
} from '../utils'
import {
  type SelectionBoxObject,
  type MouseEventHandler,
  type SelectableElement,
} from '../sharedTypes'

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

export function createSelectableArea<P>(Comp: React.ComponentType<P>) {
  const AnyComp = Comp as any

  return forwardRef<
    SelectableAreaImperativeMethods,
    P & SelectableAreaComponentProps
  >(
    (
      {
        options = EMPTY_OBJECT as SelectableAreaOptions,
        onSelectionStart = NOOP,
        onSelectionChange = NOOP,
        onSelectionEnd = NOOP,
        onSelectedItem = NOOP,
        onDeselectedItem = NOOP,
        ...props
      },
      ref
    ) => {
      const { selectionEnabled, ignore } = options

      const areaRef = useRef<SelectableElement>(null)
      const startSelectionBoxRef = useRef<SelectionBoxObject | null>(null)
      const selectionBoxRef = useRef<SelectionBoxObject | null>(null)

      const events = useMemo<SelectableAreaContextValue['events']>(
        () => new EventEmitter(),
        []
      )

      const imperativeMethods: SelectableAreaImperativeMethods = {
        selectAll() {
          events.trigger('selectAll', void 0)
        },
        deselectAll() {
          events.trigger('deselectAll', void 0)
        },
      }

      useImperativeHandle(ref, () => imperativeMethods, [])

      useEffect(
        () =>
          mergeUnsubFns([
            events.on('selectionStart', onSelectionStart),
            events.on('selectionChange', onSelectionChange),
            events.on('selectionEnd', onSelectionEnd),
            events.on('selectedItem', onSelectedItem),
            events.on('deselectedItem', onDeselectedItem),
          ]),
        [
          onSelectionStart,
          onSelectionChange,
          onSelectionEnd,
          onSelectedItem,
          onDeselectedItem,
        ]
      )

      useEffect(() => {
        // Avoid selection
        if (selectionEnabled === false) {
          return
        }

        // Use as HTMLElement so we can listen to mouse events
        const $area = ensureAreaRef(areaRef) as HTMLElement

        const onMouseDown = guardMouseHandler(ignore, (e) => {
          const nextSelectionBox: SelectionBoxObject = {
            ...getRelativeCoordinatesToArea($area, e),
            width: 0,
            height: 0,
          }

          const selectionEvent: SelectionEvent = {
            originalEvent: e,
            selectionBox: nextSelectionBox,
          }

          startSelectionBoxRef.current = selectionBoxRef.current =
            nextSelectionBox
          events.trigger('selectionStart', selectionEvent)

          document.addEventListener('mouseup', onMouseUp)
          document.addEventListener('mousemove', onMouseMove)
        })

        const onMouseUp: MouseEventHandler = (e) => {
          const selectionEvent: SelectionEvent = {
            originalEvent: e,
            selectionBox: selectionBoxRef.current!,
          }

          startSelectionBoxRef.current = selectionBoxRef.current = null
          events.trigger('selectionEnd', selectionEvent)

          removeMousedownCreatedEvents()
        }

        const onMouseMove: MouseEventHandler = (e) => {
          const { current: startSelectionBox } = startSelectionBoxRef
          const { x, y } = getRelativeCoordinatesToArea($area, e)

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

          selectionBoxRef.current = nextSelectionBox
          events.trigger('selectionChange', selectionEvent)
        }

        $area.addEventListener('mousedown', onMouseDown)

        const removeMousedownCreatedEvents = () => {
          document.removeEventListener('mouseup', onMouseUp)
          document.removeEventListener('mousemove', onMouseMove)
        }

        return () => {
          $area.removeEventListener('mousedown', onMouseDown)

          // Whether the component is unmount during `mousemove`
          removeMousedownCreatedEvents()
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
        <SelectableAreaContext.Provider
          value={{ areaRef, events, options, ...imperativeMethods }}>
          <AnyComp {...props} />
        </SelectableAreaContext.Provider>
      )
    }
  )
}
