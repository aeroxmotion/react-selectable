import React, { useMemo } from 'react'

import {
  type MouseEventHandler,
  type SelectableElement,
  type SelectionBoxObject,
} from './sharedTypes'
import {
  type IgnoreHandler,
  type SelectableAreaOptions,
} from './contexts/SelectableAreaContext'

export const NOOP = () => {}
export const EMPTY_OBJECT = {}

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

export const useJoinClassNames = (classNames: any[]) =>
  useMemo(() => classNames.filter(Boolean).join(' '), classNames)
