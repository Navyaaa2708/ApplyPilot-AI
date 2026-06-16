const ATTRIBUTE_WHITELIST = new Set([
  "href",
  "src",
  "alt",
  "title",
  "aria-label",
  "role",
  "type",
  "id",
  "class",
  "value",
  "name",
  "placeholder",
  "tabindex"
]);

const TEXT_REPLACEMENTS = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&#39;"]
];

export function sanitizeText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return TEXT_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function sanitizeHtml(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/on[a-z]+="[^"]*"/gi, "");
}

export function sanitizeElementAttributes(element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  Array.from(element.attributes).forEach((attribute) => {
    if (!ATTRIBUTE_WHITELIST.has(attribute.name.toLowerCase())) {
      element.removeAttribute(attribute.name);
    }
  });
}
