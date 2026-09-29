const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,

        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },

        title: "JobSprint",
    });

    const port = process.env.VITE_PORT || 5173;

    win.loadURL(`http://localhost:${port}`);

    // Uncomment this if you want DevTools
    // win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});