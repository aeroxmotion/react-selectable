/**
 * Any element valid to select.
 */
export type SelectableElement = HTMLElement | SVGElement

/**
 * For mouse-event handlers like `mousedown`, `mousemove` and `mouseup`.
 */
export type MouseEventHandler = (event: MouseEvent) => void

/**
 * Returns `true` whether the given mouse `event`
 * should be ignored, `false` otherwise.
 */
export type IgnoreHandler = (event: MouseEvent) => boolean

/**
 * Any CSS Selector or ignore handler.
 */
export type IgnoreCriteria = string | IgnoreHandler

/**
 *
 */
export type SelectableID = string | number

export interface SelectionBoxObject {
  /**
   * x-position in px relative to `SelectableArea`'s container
   */
  readonly x: number

  /**
   * y-position in px relative to `SelectableArea`'s container
   */
  readonly y: number

  /**
   * Box width in px
   */
  readonly width: number

  /**
   * Box height in px
   */
  readonly height: number
}
