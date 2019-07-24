const { app, BrowserWindow } = require('electron')

function createWindow () {
    // Stwórz okno przeglądarki.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadURL('http://google.com')
}

app.on('ready', createWindow)
