"use client"
import { ErrorBoundary } from "react-error-boundary"
import { Editor } from "@/components/Editor"
import { toastError } from "@/components/toast"
import { processMd, renderingMdTooLong, state, StateContext } from "@/state"
import { Preview } from "@/components/Preview"
import { useStore } from "@nanostores/react"
import { Spinner } from "@/components/Spinner"
import cn from "classnames"
import { Button, FilePicker } from "@/components/Button"
import { useCallback, useEffect, useState } from "react"
import { isServer } from "@/utils"
import { trackEvent } from "@/analytics"

if (!isServer) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
  window.addEventListener("afterprint", () => trackEvent("afterprint"))
}

// noinspection JSUnusedGlobalSymbols
export default function Home() {
  useEffect(() => {
    if (!isServer) {
      trackEvent("pageview")
    }
  }, [])

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
            <div
              className={cn(
                "basis-1/2 flex-none min-h-0",
                "flex flex-col border-r border-r-gray-500 noprint",
              )}
            >
              <div
                className={cn(
                  "flex gap-4 items-center",
                  "min-h-[4rem] bg-blue-100 p-2 px-4 border-b",
                )}
              >
                <span className="grow text-xl text-gray-700 uppercase">Markdown</span>

                <FilePicker onFilePicked={handleFile}>
                  <Button event="open_file">Open File</Button>
                </FilePicker>
              </div>
              <Editor key={editorKey} />
            </div>

            <div className={cn("basis-1/2 flex-none min-h-0", "flex flex-col")}>
              <div
                className={cn(
                  "flex gap-4 items-center",
                  "min-h-[4rem] bg-blue-100 p-2 px-4 border-b noprint",
                )}
              >
                <div className="grow">
                  <span className="text-xl text-gray-700 uppercase">Preview</span>
                  {longRendering ? <Spinner /> : null}
                </div>

                <Button className="min-w-[4rem]" onClick={() => window.print()} event="print">
                  Print
                </Button>
                {/* TODO Save to HTML */}
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
