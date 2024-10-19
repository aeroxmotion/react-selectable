import { useCallback, useState } from 'react'

type UpdateStateFn<S> = (
  nextState: Partial<S> | ((prevState: S) => Partial<S>)
) => void

/**
 * @internal
 */
export function useShallowState<S extends object>(
  initialState?: S | (() => S)
): [S, UpdateStateFn<S>] {
  const [state, setState] = useState<S>(initialState!)

  const updateState: UpdateStateFn<S> = useCallback(
    (nextState) =>
      setState((prevState) => {
        const nextStateObj =
          typeof nextState === 'function' ? nextState(prevState) : nextState

        const keys = Object.keys(nextStateObj) as Array<keyof S>

        for (const key of keys) {
          if (prevState[key] !== nextStateObj[key]) {
            return {
              ...prevState,
              ...nextStateObj,
            }
          }
        }

        return prevState
      }),
    []
  )

  return [state, updateState]
}
