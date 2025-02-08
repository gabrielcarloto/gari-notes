export default function invariant<T = unknown>(v: T | null | undefined): T {
  if (v === null || v === undefined) {
    throw new Error("Invariant Error: Expected value to not be nullable")
  }

  return v
}
