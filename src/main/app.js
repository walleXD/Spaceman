import { app, BrowserWindow, Menu, shell } from "electron"
import CreateWindowStateManager from "electron-window-state-manager"
import { join } from "path"
import { readFileSync } from "fs"
import defaultMenu from "electron-default-menu"

app.setAppUserModelId("me.walee.spaceman")

const MAIN_REDDIT_URL = "https://www.reddit.com"

let mainWindow

const createMainWindow = () => {
  const mainWindowState = new CreateWindowStateManager("main-window", {
    defaultWidth: 1024,
    defaultHeight: 768
  })

  const window = new BrowserWindow({
    show: false, // Hide application until your page has loaded
    title: app.getName(),
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 890,
    minHeight: 400,
    titleBarStyle: "hiddenInset",
    icon: join(__dirname, "..", "..", "static/Icon.png"),
    webPreferences: {
      preload: join(__dirname, "..", "renderer", "index.js"),
      nodeIntegration: false
    }
  })

  // only for darwin
  if (process.platform === "darwin") {
    window.setSheetOffset(600)
  }

  window.loadURL(MAIN_REDDIT_URL)

  window.once("ready-to-show", () => {
    window.show()
  })

  window.on("close", e => {
    // if (!isQuitting) {
    //   e.preventDefault()
    //   app.hide()
    // }
    mainWindow = null
  })

  return window
}

const createMainMenu = () => {
  const menu = defaultMenu(app, shell)
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}

app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("ready", () => {
  createMainMenu()
  mainWindow = createMainWindow()

  const { webContents } = mainWindow

  webContents.on("dom-ready", () => {
    webContents.insertCSS(
      readFileSync(join(__dirname, "../renderer/app.css"), "utf8")
    )
  })
})

app.on("activate", () => {
  // mainWindow.show()
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})
