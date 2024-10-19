import React, {
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
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
import { useStateRef } from '../hooks/useStateRef'

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

const MAIN_MOUSE_BUTTON = 0

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

      const areaRef = useStateRef<SelectableElement | null>(null)
      const startSelectionBoxRef = useRef<SelectionBoxObject | null>(null)
      const selectionBoxRef = useRef<SelectionBoxObject | null>(null)

      const events = useMemo<SelectableAreaContextValue['events']>(
        () => new EventEmitter(),
        []
      )

      const imperativeMethods: SelectableAreaImperativeMethods = useMemo(
        () => ({
          selectAll() {
            events.trigger('selectAll', void 0)
          },
          deselectAll() {
            events.trigger('deselectAll', void 0)
          },
        }),
        [events]
      )

      const onMouseMove: MouseEventHandler = useCallback(
        (e) => {
          const startSelectionBox = startSelectionBoxRef.current!
          const { x, y } = getRelativeCoordinatesToArea(areaRef.current!, e)

          const nextSelectionBox: SelectionBoxObject = {
            x: Math.min(startSelectionBox.x, x),
            y: Math.min(startSelectionBox.y, y),
            width: Math.abs(x - startSelectionBox.x),
            height: Math.abs(y - startSelectionBox.y),
          }

          const selectionEvent: SelectionEvent = {
            originalEvent: e,
            selectionBox: nextSelectionBox,
          }

          selectionBoxRef.current = nextSelectionBox
          events.trigger('selectionChange', selectionEvent)
        },
        [areaRef.current]
      )

      const onMouseUp: MouseEventHandler = useCallback(
        (e) => {
          const selectionEvent: SelectionEvent = {
            originalEvent: e,
            selectionBox: selectionBoxRef.current!,
          }

          startSelectionBoxRef.current = selectionBoxRef.current = null
          events.trigger('selectionEnd', selectionEvent)

          document.removeEventListener('mousemove', onMouseMove)
        },
        [onMouseMove]
      )

      const onMouseDown = useMemo(
        () =>
          guardMouseHandler(ignore, (e) => {
            if (e.button !== MAIN_MOUSE_BUTTON || e.ctrlKey) {
              return
            }

            const nextSelectionBox: SelectionBoxObject = {
              ...getRelativeCoordinatesToArea(areaRef.current!, e),
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

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp, { once: true })
          }),
        [areaRef.current, ignore, onMouseUp, onMouseMove]
      )

      useImperativeHandle(ref, () => imperativeMethods, [imperativeMethods])

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
        if (selectionEnabled === false || !areaRef.current) {
          return
        }

        const $area = areaRef.current as HTMLElement

        $area.addEventListener('mousedown', onMouseDown)

        return () => {
          $area.removeEventListener('mousedown', onMouseDown)

          document.removeEventListener('mouseup', onMouseUp)
          document.removeEventListener('mousemove', onMouseMove)
        }
      }, [
        areaRef.current,
        onMouseUp,
        onMouseDown,
        onMouseMove,
        selectionEnabled,
      ])

      return (
        <SelectableAreaContext.Provider
          value={{
            areaRef,
            events,
            options,
            ...imperativeMethods,
          }}>
          <AnyComp {...props} />
        </SelectableAreaContext.Provider>
      )
    }
  )
}
