import { useContext, useEffect, useRef, useState } from "react"
import { assertExists } from "@/utils"
import debounce from "lodash/debounce"
import { processMd, StateContext } from "@/state"
import cn from "classnames"
import { useStore } from "@nanostores/react"

const debouncedProcessMd = debounce(processMd, 1000)

export const Editor = () => {
  const state = useContext(StateContext)
  const { md } = useStore(state)
  const ref = useRef<HTMLDivElement>(null)

  const [editorContentInitialized, setEditorContentInitialized] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [hasContent, setHasContent] = useState(() => md.length > 0)
  const showPlaceholder = editorContentInitialized && !hasFocus && !hasContent

  useEffect(() => {
    const div = assertExists(ref.current)
    div.innerText = state.get().md
    setEditorContentInitialized(true)

    const handleInput = () => {
      const content = div.innerText.trim()
      setHasContent(content !== "")
      debouncedProcessMd(content)
    }

    div.addEventListener("input", handleInput)
    return () => div.removeEventListener("input", handleInput)
  }, [state])

  return (
    <>
      <div
        ref={ref}
        className={cn("h-full overflow-y-scroll p-3 text-sm focus:outline-none", {
          hidden: false,
        })}
        style={{
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
        }}
        contentEditable={true}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      >
        {showPlaceholder && <span className="text-gray-400">Enter Markdown here</span>}
      </div>
    </>
  )
}
