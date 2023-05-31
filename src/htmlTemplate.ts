// node_modules/@primer/css/index.scss

// @ts-ignore
import mdCss from "!!raw-loader!./md.css"
// @ts-ignore
import template from "!!raw-loader!./template.html"
// @ts-ignore
import colorModes from "!!raw-loader!@primer/css/dist/color-modes.css"
// @ts-ignore
import core from "!!raw-loader!@primer/css/dist/core.css"
// @ts-ignore
import product from "!!raw-loader!@primer/css/dist/product.css"
// @ts-ignore
import syntax from "!!raw-loader!github-syntax-light/lib/github-light.css"
// @ts-ignore
import iframeResizer from "!!raw-loader!iframe-resizer/js/iframeResizer.contentWindow.min.js"

function getMdStyles(): string {
  const combined = [colorModes, core, product, syntax, mdCss].join("\n")
  return `<style>${combined}</style>`
}

const canonicalUrl = process.env["NEXT_PUBLIC_CANONICAL_URL"] ?? "magic"

const htmlTemplate = template
  .replace("{styles}", getMdStyles())
  .replace("{iframeResizer}", iframeResizer)
  .replace("{generatedBy}", canonicalUrl)

export const renderFullHtml = (content: string): string =>
  htmlTemplate.replace("{content}", content)
