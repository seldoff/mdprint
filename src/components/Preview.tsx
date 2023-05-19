import { useContext } from "react"
import { StateContext } from "@/state"
import { useStore } from "@nanostores/react"

export const Preview = () => {
  const state = useContext(StateContext)
  const { renderedMd } = useStore(state)

  return (
    <div className="h-full overflow-y-scroll p-3 markdown-body">
      <div dangerouslySetInnerHTML={{ __html: renderedMd }}></div>
    </div>
  )
}
