import React, { useRef, useMemo, useEffect } from 'react'

import {
  SelectableAreaContextValue,
  SelectionBoxObject,
  SelectableAreaContext,
  SelectableAreaOptions,
} from '../contexts/SelectableAreaContext'
import { EventEmitter } from '../EventEmitter'

export interface SelectableAreaComponentProps {
  /**
   *
   */
  options?: SelectableAreaOptions

  /**
   *
   */
  onSelectionStart?: (selectionBox: SelectionBoxObject) => void

  /**
   *
   */
  onSelectionChange?: (selectionBox: SelectionBoxObject) => void

  /**
   *
   */
  onSelectionEnd?: (selectionBox: SelectionBoxObject) => void
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
    const areaRef = useRef<HTMLElement | null>(null)
    const startSelectionBoxRef = useRef<SelectionBoxObject | null>(null)
    const selectionBoxRef = useRef<SelectionBoxObject | null>(null)

    const events = useMemo<SelectableAreaContextValue['events']>(
      () => new EventEmitter(),
      []
    )

    useEffect(() => {
      if (options.selectionEnabled === false) {
        return
      }

      const { current: $area } = areaRef

      const guardMouseHandler =
        (handler: (e: MouseEvent) => void) => (e: MouseEvent) => {
          if (options.ignoreMouseEvents?.length) {
            const ignoreSelector = options.ignoreMouseEvents.join(', ')

            if ((e.target as Element).matches(ignoreSelector)) {
              return
            }
          }

          handler(e)
        }

      const getRelativeCoordinates = (e: MouseEvent) => {
        const areaRect = $area!.getBoundingClientRect()

        return {
          x: e.clientX - areaRect.x,
          y: e.clientY - areaRect.y,
        }
      }

      const onMousedown = guardMouseHandler((e) => {
        const nextSelectionBox: SelectionBoxObject = {
          ...getRelativeCoordinates(e),
          width: 0,
          height: 0,
        }

        startSelectionBoxRef.current = selectionBoxRef.current =
          nextSelectionBox

        onSelectionStart(nextSelectionBox)
        events.trigger('selectionStart', nextSelectionBox)

        $area!.addEventListener('mousemove', onMousemove)
      })

      const onMouseup = guardMouseHandler(() => {
        onSelectionEnd(selectionBoxRef.current!)
        events.trigger('selectionEnd', selectionBoxRef.current!)
        startSelectionBoxRef.current = selectionBoxRef.current = null

        $area!.removeEventListener('mousemove', onMousemove)
      })

      const onMousemove = guardMouseHandler((e) => {
        const { current: startSelectionBox } = startSelectionBoxRef
        const { x, y } = getRelativeCoordinates(e)

        const nextSelectionBox: SelectionBoxObject = {
          x: Math.min(startSelectionBox!.x, x),
          y: Math.min(startSelectionBox!.y, y),
          width: Math.abs(x - startSelectionBox!.x),
          height: Math.abs(y - startSelectionBox!.y),
        }

        onSelectionChange(nextSelectionBox)
        selectionBoxRef.current = nextSelectionBox
        events.trigger('selectionChange', nextSelectionBox)
      })

      $area!.addEventListener('mousedown', onMousedown)
      $area!.addEventListener('mouseup', onMouseup)

      return () => {
        $area!.removeEventListener('mousedown', onMousedown)
        $area!.removeEventListener('mouseup', onMouseup)

        // Whether the component is unmount during `mousemove`
        $area!.removeEventListener('mousemove', onMousemove)
      }
    }, [
      options.selectionEnabled,
      options.ignoreMouseEvents,
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
