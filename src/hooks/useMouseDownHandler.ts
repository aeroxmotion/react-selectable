import { type DependencyList, useCallback, useMemo } from 'react'

import {
  type IgnoreHandler,
  type IgnoreCriteria,
  type MouseEventHandler,
} from '../sharedTypes'

/**
 * See: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
 */
const MAIN_MOUSE_BUTTON = 0

const createSelectorIgnoreHandler =
  (selector: string): IgnoreHandler =>
  (event) => {
    const target = event.target as Element

    return target.matches(selector)
  }

/**
 * @internal
 */
export function useMouseDownHandler(
  handler: MouseEventHandler,
  ignore: IgnoreCriteria[] | undefined,
  deps: DependencyList
): MouseEventHandler {
  const ignoreHandlers = useMemo(
    () =>
      ignore?.map<IgnoreHandler>((criteria) =>
        typeof criteria === 'string'
          ? createSelectorIgnoreHandler(criteria)
          : criteria
      ),
    [ignore]
  )

  return useCallback(
    (event) => {
      if (ignoreHandlers?.length) {
        for (const shouldIgnore of ignoreHandlers) {
          if (shouldIgnore(event)) {
            return
          }
        }
      }

      if (event.button === MAIN_MOUSE_BUTTON && !event.ctrlKey) {
        handler(event)
      }
    },
    [ignoreHandlers, ...deps]
  )
}
