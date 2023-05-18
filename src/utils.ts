export function assert(condition: boolean, message?: string | (() => string)): asserts condition {
  if (!condition) {
    if (typeof message === "function") {
      message = message()
    }
    throw new Error(message ?? "Assertion failed")
  }
}

export function assertExists<T>(value: T | undefined | null, message?: string | (() => string)): T {
  assert(value !== undefined && value !== null, message)
  return value
}

export function assertExists2<T>(
  value: T | undefined | null,
  message?: string | (() => string),
): asserts value is T {
  assert(value !== undefined && value !== null, message)
}

export const isDevEnv = process.env.NODE_ENV !== "production"
