import {Observable} from 'rxjs'

export const fromResizeEvent = <T extends Element>(elem: T) => {
  return new Observable<ResizeObserverSize>(subscriber => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = entry.contentBoxSize[0]
          subscriber.next({
            blockSize: contentBoxSize.blockSize,
            inlineSize: contentBoxSize.inlineSize,
          })
        }
      }
    })

    resizeObserver.observe(elem)
    return function unsubscribe() {
      resizeObserver.unobserve(elem)
    }
  })
}
