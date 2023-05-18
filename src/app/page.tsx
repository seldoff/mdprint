"use client"
import { ErrorBoundary } from "react-error-boundary"
import "./md.css"
import { Editor } from "@/components/Editor"
import { toastError } from "@/components/toast"
import { state, StateContext } from "@/state"
import { Preview } from "@/components/Preview"

if (global.window) {
  window.addEventListener("error", (e) => toastError(e.message))
  window.addEventListener("unhandledrejection", (e) => toastError(e.reason))
}

// noinspection JSUnusedGlobalSymbols
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
