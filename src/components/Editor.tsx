import { useContext, useEffect, useRef } from "react"
import { assert, assertExists } from "@/utils"
import debounce from "lodash/debounce"
import { processNewMd, StateContext } from "@/state"

export const Editor = () => {
  const state = useContext(StateContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    assert(state.get().md === "", "md is not empty on mount")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const div = assertExists(ref.current)
    const handleInput = () => processNewMd(div.innerText.trim())
    const debounced = debounce(handleInput, 1000)

    div.addEventListener("input", debounced)
    return () => div.removeEventListener("input", debounced)
  }, [])

  return (
    <div
      ref={ref}
      className="h-full overflow-y-scroll p-3 text-sm focus:outline-none"
      style={{
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
      }}
      contentEditable={true}
    />
  )
}
