import { ChangeEventHandler, useCallback, useContext, useState } from "react"
import debounce from "lodash/debounce"
import { processMd, StateContext } from "@/state"

const debouncedProcessMd = debounce(processMd, 1000)

export const Editor = () => {
  const state = useContext(StateContext)
  const [content, setContent] = useState(() => state.get().md)

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setContent(e.target.value)
    debouncedProcessMd(e.target.value)
  }, [])

  return (
    <textarea
      placeholder="Enter Markdown here"
      className="h-full w-full p-3 text-sm font-mono focus:outline-none"
      style={{ resize: "none" }}
      value={content}
      onChange={handleChange}
    />
  )
}
