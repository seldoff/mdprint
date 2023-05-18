import { atom, WritableAtom } from "nanostores"
import { createContext } from "react"
import { isDevEnv } from "@/utils"
import ky from "ky"
import { toastError } from "@/components/toast"

export type State = {
  md: string
  renderingMd: boolean
  renderedMd: string
}

export const state = atom<State>({ md: "", renderedMd: "", renderingMd: false })
export const StateContext = createContext<WritableAtom<State>>(state)

function setState(update: Partial<State>) {
  state.set({ ...state.get(), ...update })
  isDevEnv && console.log("State updated", update)
}

export async function processNewMd(md: string) {
  setState({ md, renderingMd: true })

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

    setState({ renderedMd })
  } catch (e) {
    toastError("Can't render markdown at the moment: GitHub returned an error.")
    console.error(e)
  } finally {
    setState({ renderingMd: false })
  }
}
