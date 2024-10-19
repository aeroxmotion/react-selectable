import { useMemo } from 'react'

import { type SelectionBoxObject } from './sharedTypes'

type Coordinates = {
  x: number
  y: number
}

export const NOOP = () => {}
export const EMPTY_OBJECT = {}

export const isItemIntersected = (
  $area: Element,
  $item: Element,
  selectionBox: SelectionBoxObject
) => {
  const itemRect = $item.getBoundingClientRect()
  const itemCoordinates = getRelativeCoordinatesToArea($area, itemRect)

  return (
    itemCoordinates.x + itemRect.width >= selectionBox.x &&
    itemCoordinates.x <= selectionBox.x + selectionBox.width &&
    itemCoordinates.y + itemRect.height >= selectionBox.y &&
    itemCoordinates.y <= selectionBox.y + selectionBox.height
  )
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

export const useJoinClassNames = (classNames: any[]) =>
  useMemo(() => classNames.filter(Boolean).join(' '), classNames)
