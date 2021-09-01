import { useState, useEffect } from 'react'

import { useSelectableArea } from './useSelectableArea'
import type {
  SelectionBoxObject,
  SelectionEvent,
} from '../contexts/SelectableAreaContext'
import { mergeUnsubFns } from '../utils'

export const useSelectionBox = () => {
  const { events } = useSelectableArea()

  const [selectionBox, setSelectionBox] = useState<SelectionBoxObject | null>(
    null
  )

  useEffect(() => {
    const onSelectionChange = (e: SelectionEvent) => {
      setSelectionBox(e.selectionBox)
    }

    const onSelectionEnd = (_: SelectionEvent) => {
      setSelectionBox(null)
    }

    return mergeUnsubFns([
      events.on('selectionStart', onSelectionChange),
      events.on('selectionChange', onSelectionChange),
      events.on('selectionEnd', onSelectionEnd),
    ])
  }, [])

  return selectionBox
}
