import React, { useReducer, useState } from 'react'
import { mock } from '@mockpiler/compiler'

import {
  SelectableArea,
  SelectableItem,
  SelectionBox,
  SelectableAreaOptions,
} from '../src'
import './App.css'

const items: any[] = mock`
  [
    (25) {
      id: ${Math.random}
      text: ${'Hey'}
    }
  ]
`

const selectionModes: SelectableAreaOptions['selectionMode'][] = [
  void 0, // <- default
  'shift',
  'alt',
]

const logEvent = (name: string) => (e: any) => console.log(`[${name}]`, e)

function App() {
  const [selectionMode, setSelectionMode] =
    useState<SelectableAreaOptions['selectionMode']>()
  const [toggleOnClick, toggleToggleOnClick] = useReducer(
    (state) => !state,
    true
  )
  const [selectionEnabled, toggleSelectionEnabled] = useReducer(
    (state) => !state,
    true
  )
  const [selectionCommands, toggleSelectionCommands] = useReducer(
    (state) => !state,
    true
  )

  const handleSelectionModeOnChange: React.SelectHTMLAttributes<HTMLSelectElement>['onChange'] =
    (e) => {
      setSelectionMode(e.target.value as any)
    }

  return (
    <SelectableArea
      tag="section"
      options={{
        selectionEnabled,
        selectionMode,
        selectionCommands,
        toggleOnClick,
        ignore: [
          '.fixed-buttons',
          ({ target }) => (target as Element).matches('.fixed-buttons *'),
        ],
      }}
      onSelectionStart={logEvent('selection-start')}
      onSelectionChange={logEvent('selection-change')}
      onSelectionEnd={logEvent('selection-end')}
      onSelectedItem={logEvent('selected-item')}
      onDeselectedItem={logEvent('deselected-item')}>
      <SelectionBox />

      {items.map((item) => (
        <SelectableItem tag="article" key={item.id} selectableValue={item.id}>
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
        <select onChange={handleSelectionModeOnChange} value={selectionMode}>
          {selectionModes.map((mode) => (
            <option key={mode ?? 'default'} value={mode}>
              Selection Mode: {mode ?? 'default'}
            </option>
          ))}
        </select>

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
