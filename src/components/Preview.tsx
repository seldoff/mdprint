import { useContext, useEffect, useState } from "react"
import { StateContext } from "@/state"
import { useStore } from "@nanostores/react"
import cn from "classnames"

export const Preview = () => {
  const state = useContext(StateContext)
  const { renderedMd, renderingMd } = useStore(state)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (renderingMd) {
      const timeout = setTimeout(() => state.get().renderingMd && setLoading(true), 500)
      return () => clearTimeout(timeout)
    } else {
      setLoading(false)
      return undefined
    }
  }, [renderingMd, state])

  return (
    <div className={cn("h-full overflow-y-scroll p-3 markdown-body", { "opacity-30": loading })}>
      <div dangerouslySetInnerHTML={{ __html: renderedMd }}></div>
    </div>
  )
}
