import fs from "node:fs/promises"
import DOMPurify from "dompurify"

test("sanitize", async () => {
  const notSanitized = await fs.readFile("tests/all_features.html", { encoding: "utf-8" })
  const actual = DOMPurify.sanitize(notSanitized)
  expect(actual).toMatchSnapshot()
})
