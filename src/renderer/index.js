const init = () => {
  console.log("hello")
}

if (document.readyState !== "loading") {
  init()
} else {
  document.addEventListener("DOMContentLoaded", init)
}
