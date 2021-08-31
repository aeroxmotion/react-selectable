# @aeroxmotion/react-selectable

My own implementation of `react-selectable-fast`

## Simple usage

```tsx
import { render } from 'react-dom'
import {
  SelectableArea,
  SelectableItem,
  SelectionBox,
} from '@aeroxmotion/react-selectable'

const items = [
  {
    id: 1,
    name: 'Selectable 1',
  },
  {
    id: 2,
    name: 'Selectable 2',
  },
  {
    id: 3,
    name: 'Selectable 3',
  },
]

const MyComponent = () => {
  return (
    <SelectableArea>
      <SelectionBox />

      {items.map((item) => (
        <SelectableItem key={item.id}>
          <p>{item.name}</p>
        </SelectableItem>
      ))}
    </SelectableArea>
  )
}

render(<MyComponent />, document.getElementById('root'))
```

## How it works

This library uses an event-based approach to detect selected items by injecting an `EventEmitter` through context to every selectable item.
