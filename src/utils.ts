import { useCallback, useState } from 'react'
import type {
  SelectableAreaOptions,
  SelectionBoxObject,
} from './contexts/SelectableAreaContext'

type UpdateStateFn<S> = (
  nextState: Partial<S> | ((prevState: S) => Partial<S>)
) => void

export function useShallowState<S extends object>(
  initialState?: S | (() => S)
): [S, UpdateStateFn<S>] {
  const [state, setState] = useState<S>(initialState!)

  const updateState: UpdateStateFn<S> = useCallback((nextState) => {
    setState((prevState) => {
      const nextStateObj =
        typeof nextState === 'function' ? nextState(prevState) : nextState

      const keys: Array<keyof S> = Object.keys(nextStateObj) as any

      for (const key of keys) {
        if (prevState[key] !== nextStateObj[key]) {
          return {
            ...prevState,
            ...nextStateObj,
          }
        }
      }

      return prevState
    })
  }, [])

  return [state, updateState]
}

export const isItemIntersected = (
  $area: Element,
  $item: Element,
  selectionBox: SelectionBoxObject
) => {
  const itemRect = $item.getBoundingClientRect()
  const areaRect = $area.getBoundingClientRect()

  const itemCoordinates = {
    x: itemRect.x - areaRect.x,
    y: itemRect.y - areaRect.y,
  }

  if (itemCoordinates.x + itemRect.width < selectionBox.x) {
    return false
  }

  if (itemCoordinates.x > selectionBox.x + selectionBox.width) {
    return false
  }

  if (itemCoordinates.y + itemRect.height < selectionBox.y) {
    return false
  }

  if (itemCoordinates.y > selectionBox.y + selectionBox.height) {
    return false
  }

  return true
}

export type MouseEventHandler = (e: MouseEvent) => void

export const guardMouseHandler = (
  ignore: SelectableAreaOptions['ignore'] | undefined,
  handler: MouseEventHandler
): MouseEventHandler =>
  !ignore?.length
    ? handler
    : (e: MouseEvent) => {
        if (!(e.target as Element).matches(ignore.join(', '))) {
          handler(e)
        }
      }

export const getRelativeCoordinates = ($area: Element, e: MouseEvent) => {
  const areaRect = $area.getBoundingClientRect()

  return {
    x: e.clientX - areaRect.x,
    y: e.clientY - areaRect.y,
  }
}

export const mergeUnsubFns = (unsubFns: Array<() => void>) => () => {
  for (const unsubFn of unsubFns) {
    unsubFn()
  }
}
