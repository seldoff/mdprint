import { useContext, useMemo } from "react"
import { StateContext } from "@/state"
import { useStore } from "@nanostores/react"
import { renderFullHtml } from "@/htmlTemplate"
import IframeResizer from "iframe-resizer-react"

export const Preview = () => {
  const state = useContext(StateContext)
  const { renderedMd } = useStore(state)
  const empty = renderedMd === ""
  const html = useMemo(() => (empty ? "" : renderFullHtml(renderedMd)), [empty, renderedMd])

  return empty ? (
    // gray-400+opacity to match Editor's placeholder color
    <span className="p-3 text-gray-400 opacity-80">Rendered Markdown will appear here</span>
  ) : (
    <IframeResizer
      srcDoc={html}
      checkOrigin={false}
      // https://github.com/davidjbradshaw/iframe-resizer-react#typical-setup
      style={{ width: "1px", minWidth: "100%" }}
    />
  )
}
