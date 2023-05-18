"use client"
import { ErrorBoundary } from "react-error-boundary"
import "./md.css"
import { Editor } from "@/components/Editor"
import { toastError } from "@/components/toast"
import { state, StateContext } from "@/state"
import { Preview } from "@/components/Preview"
import { Toolbar } from "@/components/Toolbar"

if (global.window) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
}

// noinspection JSUnusedGlobalSymbols
export default function Home() {
  return (
    <main>
      <title>MD.PRINT</title>

      <ErrorBoundary fallback={<div></div>} onError={toastError}>
        <StateContext.Provider value={state}>
          <div className="flex flex-col h-screen">
            <div className="border-b noprint">
              <Toolbar />
            </div>
            <div className="flex flex-1">
              <div className="flex-1 noprint border-r">
                <Editor />
              </div>
              <div className="flex-1">
                <Preview />
              </div>
            </div>
          </div>
        </StateContext.Provider>
      </ErrorBoundary>
    </main>
  )
}
