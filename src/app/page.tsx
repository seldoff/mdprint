"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { assert, assertExists, isDevEnv } from "@/utils"
import { atom, WritableAtom } from "nanostores"
import debounce from "lodash/debounce"
import ky from "ky"
import { useStore } from "@nanostores/react"
import cn from "classnames"
import toast, { toastConfig } from "react-simple-toasts"
import { ErrorBoundary } from "react-error-boundary"
import "./md.css"

type State = {
  md: string
  renderingMd: boolean
  renderedMd: string
}

const state = atom<State>({ md: "", renderedMd: "", renderingMd: false })
const StateContext = createContext<WritableAtom<State>>(state)

function setState(update: Partial<State>) {
  state.set({ ...state.get(), ...update })
  isDevEnv && console.log("State updated", update)
}

async function processNewMd(md: string) {
  setState({ md, renderingMd: true })

  try {
    const renderedMd = await ky
      .post("https://api.github.com/markdown", {
        headers: {
          ["X-GitHub-Api-Version"]: "2022-11-28",
          //Authorization: `Bearer1: ${process.env["GH_API_TOKEN"]}`,
          Accept: "application/vnd.github+json",
        },
        json: { text: md },
      })
      .text()

    setState({ renderedMd })
  } catch (e) {
    toastError("Can't render markdown at the moment: GitHub returned an error.")
    console.error(e)
  } finally {
    setState({ renderingMd: false })
  }
}

toastConfig({
  duration: 10_000,
  position: "top-center",
  maxVisibleToasts: 5,
})

function toastError(error: unknown) {
  const close = toast(String(error), {
    render: (msg) => (
      <div
        className="p-4 bg-red-400 text-white rounded-md shadow-xl cursor-pointer"
        onClick={close}
      >
        {msg}
      </div>
    ),
  }).close
}

if (global.window) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
}

// TODO monospaced font in editor

export default function Home() {
  return (
    <main>
      <title>MD2HTML</title>

      <ErrorBoundary fallback={<div></div>} onError={toastError}>
        <StateContext.Provider value={state}>
          <div className="flex h-screen p-0.5">
            <div className="flex-1">
              <Editor />
            </div>
            <div className="w-0.5 bg-gray-400" />
            <div className="flex-1">
              <Preview />
            </div>
          </div>
        </StateContext.Provider>
      </ErrorBoundary>
    </main>
  )
}

const Editor = () => {
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

  return <div ref={ref} className="h-full overflow-y-scroll p-1" contentEditable={true} />
}

const Preview = () => {
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
    <div className={cn("h-full overflow-y-scroll p-1 markdown-body", { "opacity-30": loading })}>
      <div dangerouslySetInnerHTML={{ __html: renderedMd }}></div>
    </div>
  )
}
