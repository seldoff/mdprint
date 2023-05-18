"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { assertExists } from "@/utils"

export default function Home() {
  return (
    <main>
      <title>MD2HTML</title>

      <div className="flex h-screen">
        <div className="flex-1">
          <Editor />
        </div>
        <div className="w-0.5 bg-gray-400" />
        <div className="flex-1">
          <Preview />
        </div>
      </div>
    </main>
  )
}

const Editor = () => {
  const [content, setContent] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(content)
  }, [content])

  useEffect(() => {
    const div = assertExists(ref.current)
    const handleInput = () => setContent(div.innerText)

    div.addEventListener("input", handleInput)
    return () => div.removeEventListener("input", handleInput)
  }, [])

  return <div ref={ref} className="h-full p-1 bg-emerald-100" contentEditable={true} />
}

const Preview = () => {
  return <div className="h-full p-1 bg-fuchsia-100">Preview</div>
}
