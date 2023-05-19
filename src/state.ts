import { atom, map, MapStore } from "nanostores"
import { createContext } from "react"
import ky from "ky"
import { toastError } from "@/components/toast"

export type State = {
  md: string
  renderingMd: boolean
  renderedMd: string
}

export const state = map<State>({ md: "", renderedMd: "", renderingMd: false })
export const StateContext = createContext<MapStore<State>>(state)

export const longRenderingMd = atom(false)

state.subscribe((s, changedKey) => {
  if (changedKey !== "renderingMd") {
    return
  }

  if (s.renderingMd) {
    setTimeout(() => {
      state.get().renderingMd && longRenderingMd.set(true)
    }, 1000)
  } else {
    longRenderingMd.set(false)
  }
})

export async function processNewMd(md: string) {
  state.setKey("md", md)
  state.setKey("renderingMd", true)

  try {
    const renderedMd = await ky
      .post("https://api.github.com/markdown", {
        headers: {
          ["X-GitHub-Api-Version"]: "2022-11-28",
          //Authorization: `Bearer1: ${process.env["GH_API_TOKEN"]}`,
          Accept: "application/vnd.github+json",
        },
        json: { text: md },
      })
      .text()

    state.setKey("renderedMd", renderedMd)
  } catch (e) {
    toastError("Can't render markdown at the moment: GitHub returned an error.")
    console.error(e)
  } finally {
    state.setKey("renderingMd", false)
  }
}
