import { useContext } from 'react'

import { SelectableAreaContext } from '../contexts/SelectableAreaContext'

/**
 * Alias function to get the `SelectableArea`'s context
 */
export const useSelectableArea = () => useContext(SelectableAreaContext)
