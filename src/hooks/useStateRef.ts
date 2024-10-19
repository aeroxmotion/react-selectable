import { type MutableRefObject, useRef, useMemo, useState } from 'react'

/**
 * @internal
 */
export function useStateRef<T>(initialValue: T): MutableRefObject<T> {
  const innerRef = useRef(initialValue)
  const [_, rerender] = useState({})

  return useMemo(
    () => ({
      get current() {
        return innerRef.current
      },
      set current(nextValue) {
        innerRef.current = nextValue
        rerender({})
      },
    }),
    [innerRef]
  )
}
