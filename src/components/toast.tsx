import toast, { toastConfig } from "react-simple-toasts"

toastConfig({
  duration: 10_000,
  position: "top-center",
  maxVisibleToasts: 5,
})

export function toastError(error: unknown) {
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
