import { ButtonHTMLAttributes, FC, PropsWithChildren, useCallback, useRef, useState } from "react"
import cn from "classnames"
import { assertExists } from "@/utils"

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { className: _, ...propsWoCN } = props

  return (
    <button
      className={cn(
        props.className,
        "text-sm text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
        "px-3 py-1 cursor-pointer rounded",
      )}
      {...propsWoCN}
    >
      {props.children}
    </button>
  )
}

export const FilePicker: FC<PropsWithChildren<{ onFilePicked: (content: string) => unknown }>> = ({
  onFilePicked,
  children,
}) => {
  const [value, setValue] = useState("")
  const ref = useRef<HTMLInputElement>(null)

  const handleClick = useCallback(() => {
    const input = assertExists(ref.current)
    input.click()
  }, [])

  const handleChange = useCallback(async () => {
    const input = assertExists(ref.current)
    const { files } = input
    if (files !== null && files.length > 0) {
      const content = await files[0].text()
      onFilePicked(content)
      setValue("")
    }
  }, [onFilePicked])

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <input type="file" ref={ref} value={value} className="hidden" onChange={handleChange} />
    </>
  )
}
