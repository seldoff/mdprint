import {
  ButtonHTMLAttributes,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react"
import cn from "classnames"
import { assertExists } from "@/utils"
import { trackEvent } from "@/analytics"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { event: string }

export const Button: FC<ButtonProps> = (props) => {
  const { className: _, event, onClick, ...rest } = props

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      trackEvent(event + "_click")
      onClick?.(e)
    },
    [event, onClick],
  )

  return (
    <button
      className={cn(
        props.className,
        "text-sm text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
        "px-3 py-1 cursor-pointer rounded min-w-[4rem]",
      )}
      onClick={handleClick}
      {...rest}
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
