"use client"
import { ErrorBoundary } from "react-error-boundary"
import "./md.css"
import { Editor } from "@/components/Editor"
import { toastError } from "@/components/toast"
import { state, StateContext } from "@/state"
import { Preview } from "@/components/Preview"
import { useStore } from "@nanostores/react"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/Spinner"
import cn from "classnames"

if (global.window) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
}

// noinspection JSUnusedGlobalSymbols
export default function Home() {
  const { renderingMd } = useStore(state)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (renderingMd) {
      const timeout = setTimeout(() => state.get().renderingMd && setLoading(true), 500)
      return () => clearTimeout(timeout)
    } else {
      setLoading(false)
      return undefined
    }
  }, [renderingMd])

  return (
    <main>
      <title>MD.PRINT</title>

      <ErrorBoundary fallback={<div></div>} onError={toastError}>
        <StateContext.Provider value={state}>
          <div className="flex h-screen">
            <div className="flex-1 flex flex-col noprint border-r border-r-gray-500">
              <div className="text-lg text-gray-700 bg-blue-100 p-2 border-b">Markdown</div>
              <Editor />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="bg-blue-100 p-2 border-b noprint flex gap-4 items-center">
                <div className="text-lg text-gray-700">Preview</div>
                {loading ? <Spinner /> : null}
              </div>
              <div className={cn({ "opacity-30": loading })}>
                <Preview />
              </div>
            </div>
          </div>
        </StateContext.Provider>
      </ErrorBoundary>
    </main>
  )
}
