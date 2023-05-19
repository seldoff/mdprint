import { useContext, useEffect, useRef, useState } from "react"
import { assert, assertExists } from "@/utils"
import debounce from "lodash/debounce"
import { processMd, StateContext } from "@/state"
import { useStore } from "@nanostores/react"
import cn from "classnames"

const debouncedProcessMd = debounce(processMd, 1000)

export const Editor = () => {
  const state = useContext(StateContext)
  const { md } = useStore(state)
  const ref = useRef<HTMLDivElement>(null)

  const [hasFocus, setHasFocus] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const showPlaceholder = !hasFocus && !hasContent

  useEffect(() => {
    assert(md === "", "md is not empty on mount")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const div = assertExists(ref.current)

    const handleInput = () => {
      const content = div.innerText.trim()
      setHasContent(content !== "")
      debouncedProcessMd(content)
    }

    div.addEventListener("input", handleInput)
    return () => div.removeEventListener("input", handleInput)
  }, [])

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
