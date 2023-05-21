import { ButtonHTMLAttributes, FC, PropsWithChildren, useCallback, useRef } from "react"
import cn from "classnames"
import { assertExists } from "@/utils"

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      className={cn(
        "text-sm text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
        "px-3 py-1 cursor-pointer rounded",
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}

export const FilePicker: FC<PropsWithChildren<{ onFilePicked: (content: string) => unknown }>> = ({
  onFilePicked,
  children,
}) => {
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
    }
  }, [onFilePicked])

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <input type="file" ref={ref} className="hidden" onChange={handleChange} />
    </>
  )
}
