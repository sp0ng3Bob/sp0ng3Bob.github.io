export function injectCSS(css) {
  const style = document.createElement("style")
  style.type = "text/css"
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}
