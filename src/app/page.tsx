"use client"
import { ErrorBoundary } from "react-error-boundary"
import "./md.css"
import { Editor } from "@/components/Editor"
import { toastError } from "@/components/toast"
import { processMd, renderingMdTooLong, state, StateContext } from "@/state"
import { Preview } from "@/components/Preview"
import { useStore } from "@nanostores/react"
import { Spinner } from "@/components/Spinner"
import cn from "classnames"
import { Button, FilePicker } from "@/components/Button"
import { useCallback, useState } from "react"
import { isServer } from "@/utils"

if (!isServer) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
}

// noinspection JSUnusedGlobalSymbols
export default function Home() {
  const longRendering = useStore(renderingMdTooLong)

  const [editorKey, setEditorKey] = useState(0)
  const handleFile = useCallback(async (content: string) => {
    await processMd(content)
    setEditorKey((key) => key + 1) // Remount the editor
  }, [])

  return (
    <main>
      <title>MD.PRINT</title>

      <ErrorBoundary fallback={<div></div>} onError={toastError}>
        <StateContext.Provider value={state}>
          <div className="flex flex-col md:flex-row h-screen">
            <div className="basis-1/2 flex-none min-h-0 flex flex-col border-r border-r-gray-500 noprint">
              <div className="min-h-[4rem] text-lg text-gray-700 bg-blue-100 p-2 pl-4 border-b flex gap-4 items-center">
                <span>Markdown</span>
                <FilePicker onFilePicked={handleFile}>
                  <Button>Open File</Button>
                </FilePicker>
              </div>
              <Editor key={editorKey} />
            </div>

            <div className="basis-1/2 flex-none min-h-0 flex flex-col">
              <div className="min-h-[4rem] bg-blue-100 p-2 pl-4 border-b flex gap-4 items-center noprint">
                <div className="text-lg text-gray-700">Preview</div>
                {longRendering ? <Spinner /> : null}
              </div>
              <div className={cn("overflow-y-scroll", { "opacity-30": longRendering })}>
                <Preview />
              </div>
            </div>
          </div>
        </StateContext.Provider>
      </ErrorBoundary>
    </main>
  )
}
