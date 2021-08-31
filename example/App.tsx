import React, { useState } from 'react'
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
  const [shiftMode, setShiftMode] = useState(true)
  const [selectionEnabled, setSelectionEnabled] = useState(true)

  const toggleShiftMode = () => setShiftMode((prevShiftMode) => !prevShiftMode)
  const toggleSelectionEnabled = () =>
    setSelectionEnabled((prevSelectionEnabled) => !prevSelectionEnabled)

  return (
    <SelectableArea
      options={{
        selectionEnabled,
        shiftMode,
        ignoreMouseEvents: ['.fixed-buttons > button'],
      }}>
      <SelectionBox />

      {items.map((item) => (
        <SelectableItem key={item.id}>{item.text}</SelectableItem>
      ))}

      <div className="fixed-buttons">
        <button onClick={toggleShiftMode}>
          Shift Mode: {shiftMode ? 'ON' : 'OFF'}
        </button>

        <button onClick={toggleSelectionEnabled}>
          Selection Enabled: {selectionEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </SelectableArea>
  )
}

export default App
