import { useState, useEffect } from 'react'

import { useSelectableArea } from './useSelectableArea'
import type { SelectionBoxObject } from '../contexts/SelectableAreaContext'

export const useSelectionBox = () => {
  const { events } = useSelectableArea()

  const [selectionBox, setSelectionBox] = useState<SelectionBoxObject | null>(
    null
  )

  useEffect(() => {
    const onSelectionChange = (e: CustomEvent<SelectionBoxObject>) => {
      setSelectionBox(e.detail)
    }

    const onSelectionEnd = (_: CustomEvent<SelectionBoxObject>) => {
      setSelectionBox(null)
    }

    const removeSelectionStart = events.on('selectionStart', onSelectionChange)
    const removeSelectionChange = events.on(
      'selectionChange',
      onSelectionChange
    )
    const removeSelectionEnd = events.on('selectionEnd', onSelectionEnd)

    return () => {
      removeSelectionStart()
      removeSelectionChange()
      removeSelectionEnd()
    }
  }, [])

  return selectionBox
}
