/**
 * Structured data is written into the page with dangerouslySetInnerHTML, so a "<" inside any
 * editable field would otherwise be able to close the script tag. Escaping the three
 * characters that can start a tag leaves the JSON valid and the markup inert.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
