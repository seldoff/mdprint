import { useContext } from "react"
import { StateContext } from "@/state"
import { useStore } from "@nanostores/react"

export const Preview = () => {
  const state = useContext(StateContext)
  const { renderedMd } = useStore(state)

  return (
    <div className="h-full p-3 markdown-body">
      {renderedMd === "" ? (
        // gray-400+opacity to match Editor's placeholder color
        <span className="text-gray-400 opacity-80">Rendered Markdown will appear here</span>
      ) : (
        // TODO sanitize
        <div dangerouslySetInnerHTML={{ __html: renderedMd }} />
      )}
    </div>
  )
}
