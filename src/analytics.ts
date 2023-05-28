import mixpanel from "mixpanel-browser"
import { isDevEnv, isServer } from "@/utils"

const token = process.env["NEXT_PUBLIC_MIXPANEL_TOKEN"]
const enabled = token && !isServer
if (enabled) {
  mixpanel.init(token, {
    debug: isDevEnv,
    property_blacklist: ["$device_id", "$anon_distinct_id"],
    disable_persistence: true,
    autotrack: false,
    ignore_dnt: true, // We're not tracking any personal data and not using cookies
  })
  mixpanel.identify("anonymous")
} else {
  if (!token && !isServer) {
    console.warn("MIXPANEL_TOKEN is not set")
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (enabled) {
    mixpanel.track(name, props)
  }
}
