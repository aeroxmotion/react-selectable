import React, { useRef, useMemo, useEffect } from 'react'

import {
  SelectableAreaContextValue,
  SelectionBoxObject,
  SelectableAreaContext,
} from '../contexts/SelectableAreaContext'
import { EventEmitter } from '../EventEmitter'

export function selectableArea<T extends React.FC<any>>(Comp: T): T {
  const AnyComp = Comp as any

  const Result: React.FC<any> = ({ ...props }) => {
    const areaRef = useRef<HTMLElement | null>(null)
    const startSelectionBoxRef = useRef<SelectionBoxObject | null>(null)
    const selectionBoxRef = useRef<SelectionBoxObject | null>(null)

    const events = useMemo<SelectableAreaContextValue['events']>(
      () => new EventEmitter(),
      []
    )

    useEffect(() => {
      const { current: $area } = areaRef

      const getRelativeCoordinates = (e: MouseEvent) => {
        const areaRect = $area!.getBoundingClientRect()

        return {
          x: e.clientX - areaRect.x,
          y: e.clientY - areaRect.y,
        }
      }

      const onMousedown = (e: MouseEvent) => {
        const nextSelectionBox: SelectionBoxObject = {
          ...getRelativeCoordinates(e),
          width: 0,
          height: 0,
        }

        startSelectionBoxRef.current = selectionBoxRef.current =
          nextSelectionBox
        events.trigger('selectionStart', nextSelectionBox)

        $area!.addEventListener('mousemove', onMousemove)
      }

      const onMouseup = (_: MouseEvent) => {
        events.trigger('selectionEnd', selectionBoxRef.current!)
        startSelectionBoxRef.current = selectionBoxRef.current = null

        $area!.removeEventListener('mousemove', onMousemove)
      }

      const onMousemove = (e: MouseEvent) => {
        const { current: startSelectionBox } = startSelectionBoxRef
        const { x, y } = getRelativeCoordinates(e)

        const nextSelectionBox: SelectionBoxObject = {
          x: Math.min(startSelectionBox!.x, x),
          y: Math.min(startSelectionBox!.y, y),
          width: Math.abs(x - startSelectionBox!.x),
          height: Math.abs(y - startSelectionBox!.y),
        }

        selectionBoxRef.current = nextSelectionBox
        events.trigger('selectionChange', nextSelectionBox)
      }

      $area!.addEventListener('mousedown', onMousedown)
      $area!.addEventListener('mouseup', onMouseup)

      return () => {
        $area!.removeEventListener('mousedown', onMousedown)
        $area!.removeEventListener('mouseup', onMouseup)

        // Whether the component is unmount during `mousemove`
        $area!.removeEventListener('mousemove', onMousemove)
      }
    }, [])

    return (
      <SelectableAreaContext.Provider
        value={{
          areaRef,
          events,
        }}>
        <AnyComp {...props} />
      </SelectableAreaContext.Provider>
    )
  }

  return Result as T
}
