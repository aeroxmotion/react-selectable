import type { MouseEventHandler, SelectionBoxObject } from './sharedTypes'
import type { SelectableAreaOptions } from './contexts/SelectableAreaContext'

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
