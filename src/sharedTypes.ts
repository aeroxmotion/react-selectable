export type SelectableElement = HTMLElement | SVGElement

export type MouseEventHandler = (e: MouseEvent) => void

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
