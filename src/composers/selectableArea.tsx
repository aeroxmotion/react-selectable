import React, { useRef, useMemo, useEffect } from 'react'

import {
  SelectableAreaContextValue,
  SelectionBoxObject,
  SelectableAreaContext,
  SelectableAreaOptions,
  SelectionEvent,
} from '../contexts/SelectableAreaContext'
import { EventEmitter } from '../EventEmitter'
import {
  getRelativeCoordinates,
  guardMouseHandler,
  MouseEventHandler,
} from '../utils'

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
}

export type SelectableAreaComponent<T> = T extends React.ComponentType<
  infer Props
>
  ? React.FC<Props & SelectableAreaComponentProps>
  : never

const noop = () => {}
const EMPTY_OPTIONS: SelectableAreaOptions = {}

export function selectableArea<T>(Comp: T): SelectableAreaComponent<T> {
  const AnyComp = Comp as any

  const Result: React.FC<SelectableAreaComponentProps> = ({
    options = EMPTY_OPTIONS,
    onSelectionStart = noop,
    onSelectionChange = noop,
    onSelectionEnd = noop,
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

  return Result as any
}
