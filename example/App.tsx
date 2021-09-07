import React, { useState } from 'react'
import { mock } from '@mockpiler/compiler'

import {
  SelectableArea,
  SelectableItem,
  SelectionBox,
  SelectableAreaOptions,
} from '../src'
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

const selectionModes: SelectableAreaOptions['selectionMode'][] = [
  'shift',
  'alt',
]

const logEvent = (name: string) => (e: any) => console.log(`[${name}]`, e)

function App() {
  const [selectionMode, setSelectionMode] =
    useState<SelectableAreaOptions['selectionMode']>()
  const [toggleOnClick, setToggleOnClick] = useState(true)
  const [selectionEnabled, setSelectionEnabled] = useState(true)
  const [selectionCommands, setSelectionCommands] = useState(true)

  const toggleToggleOnClick = () =>
    setToggleOnClick((prevToggleOnClick) => !prevToggleOnClick)
  const toggleSelectionEnabled = () =>
    setSelectionEnabled((prevSelectionEnabled) => !prevSelectionEnabled)
  const toggleSelectionCommands = () =>
    setSelectionCommands((prevSelectionCommands) => !prevSelectionCommands)

  const handleSelectionModeOnChange: React.SelectHTMLAttributes<HTMLSelectElement>['onChange'] =
    (e) => {
      setSelectionMode(e.target.value as any)
    }

  return (
    <SelectableArea
      options={{
        selectionEnabled,
        selectionMode,
        selectionCommands,
        toggleOnClick,
        ignore: ['.fixed-buttons', '.fixed-buttons *'],
      }}
      onSelectionStart={logEvent('selection-start')}
      onSelectionChange={logEvent('selection-change')}
      onSelectionEnd={logEvent('selection-end')}
      onSelectedItem={logEvent('selected-item')}
      onDeselectedItem={logEvent('deselected-item')}>
      <SelectionBox />

      {items.map((item) => (
        <SelectableItem key={item.id} selectableValue={item.id}>
          {({ selecting, selected }) => (
            <>
              <p>{item.text}</p>
              {selecting && (
                <p>
                  <i>Selecting</i>
                </p>
              )}
              {selected && (
                <p>
                  <strong>Selected</strong>
                </p>
              )}
            </>
          )}
        </SelectableItem>
      ))}

      <div className="fixed-buttons">
        <span>
          Selection Mode:
          <select onChange={handleSelectionModeOnChange} value={selectionMode}>
            <option value={undefined}>default</option>

            {selectionModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </span>

        <button onClick={toggleToggleOnClick}>
          Toggle On Click: {toggleOnClick ? 'ON' : 'OFF'}
        </button>

        <button onClick={toggleSelectionEnabled}>
          Selection Enabled: {selectionEnabled ? 'ON' : 'OFF'}
        </button>

        <button onClick={toggleSelectionCommands}>
          Selection Commands: {selectionCommands ? 'ON' : 'OFF'}
        </button>
      </div>
    </SelectableArea>
  )
}

export default App
