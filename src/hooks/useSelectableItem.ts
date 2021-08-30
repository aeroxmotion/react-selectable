import { useContext } from 'react'

import { SelectableItemContext } from '../contexts/SelectableItemContext'

export const useSelectableItem = () => useContext(SelectableItemContext)
