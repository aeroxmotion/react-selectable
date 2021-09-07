import React from 'react'

import type {
  MouseEventHandler,
  SelectableElement,
  SelectionBoxObject,
} from './sharedTypes'
import type { SelectableAreaOptions } from './contexts/SelectableAreaContext'

export const NOOP = () => {}
export const EMPTY_OBJECT = {}

const warnOnRefs = new WeakSet<React.MutableRefObject<any>>()

export const ensureRef = (
  debugIdent: string,
  ref: React.MutableRefObject<SelectableElement | null>
): SelectableElement => {
  let el = ref.current!

  // Check and save the ref, so we don't have to throw the same error again
  if (el != null || warnOnRefs.has(ref)) {
    return el
  }

  warnOnRefs.add(ref)

  console.error(
    `[ReactSelectable] Missing ref for \`${debugIdent}\`.\n\n` +
      `Tip: Make sure you do \`${debugIdent}.current = ref\` or \`<Comp ref={${debugIdent}} />\` ` +
      'and set a non-nullable value as ref'
  )

  return el
}

export const ensureAreaRef = ensureRef.bind(null, 'areaRef')
export const ensureItemRef = ensureRef.bind(null, 'itemRef')

export const isItemIntersected = (
  $area: Element,
  $item: Element,
  selectionBox: SelectionBoxObject
) => {
  const itemRect = $item.getBoundingClientRect()
  const itemCoordinates = getRelativeCoordinatesToArea($area, itemRect)

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

type Coordinates = {
  x: number
  y: number
}

export const getRelativeCoordinatesToArea = (
  $area: Element,
  coords: Coordinates
): Coordinates => {
  const areaRect = $area.getBoundingClientRect()

  return {
    x: coords.x - areaRect.x + $area.scrollLeft,
    y: coords.y - areaRect.y + $area.scrollTop,
  }
}

export const mergeUnsubFns = (unsubFns: Array<() => void>) => () => {
  for (const unsubFn of unsubFns) {
    unsubFn()
  }
}
