import React from 'react'
import { mock } from '@mockpiler/compiler'

import { SelectableArea, SelectableItem, SelectionBox } from '../src'
import './App.css'

const items: any[] = mock({
  id: Math.random,
  text: 'Hey!',
})`
  [
    (25) {
      id
      text
    }
  ]
`

function App() {
  return (
    <SelectableArea>
      <SelectionBox />

      {items.map((item) => (
        <SelectableItem key={item.id}>{item.text}</SelectableItem>
      ))}
    </SelectableArea>
  )
}

export default App
