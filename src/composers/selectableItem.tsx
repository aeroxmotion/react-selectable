import React, { useEffect, useRef, useState } from 'react'

import type { SelectionBoxObject } from '../contexts/SelectableAreaContext'
import { SelectableItemContext } from '../contexts/SelectableItemContext'
import { useSelectableArea } from '../hooks/useSelectableArea'

let i = 0

export function selectableItem<T extends React.FC<any>>(Comp: T): T {
  const AnyComp = Comp as any

  const Result: React.FC<any> = ({ ...props }) => {
    const { areaRef, events } = useSelectableArea()

    const itemRef = useRef<Element | null>(null)

    const [selecting, setSelecting] = useState(false)
    const [selected, setSelected] = useState(false)

    const isItemIntersected = (selectionBox: SelectionBoxObject) => {
      const { current: $item } = itemRef

      const itemRect = $item!.getBoundingClientRect()
      const areaRect = areaRef.current!.getBoundingClientRect()

      const itemCoordinates = {
        x: itemRect.x - areaRect.x,
        y: itemRect.y - areaRect.y,
      }

      console.log('Itembox', ++i, itemRect)

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

    useEffect(() => {
      const onSelecting = (e: CustomEvent<SelectionBoxObject>) => {
        setSelecting(isItemIntersected(e.detail))
      }

      const onSelected = (e: CustomEvent<SelectionBoxObject>) => {
        setSelected(isItemIntersected(e.detail))
        setSelecting(false)
      }

      const onSelectAll = () => {
        setSelected(true)
      }

      const onDeselectAll = () => {
        setSelected(false)
      }

      events.on('selectionStart', onSelecting)
      events.on('selectionChange', onSelecting)
      events.on('selectionEnd', onSelected)

      events.on('selectAll', onSelectAll)
      events.on('deselectAll', onDeselectAll)
    }, [])

    return (
      <SelectableItemContext.Provider
        value={{
          itemRef,
          selecting,
          selected,
        }}>
        <AnyComp {...props} />
      </SelectableItemContext.Provider>
    )
  }

  return Result as T
}
