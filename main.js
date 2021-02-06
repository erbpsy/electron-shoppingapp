const electron = require('electron')
const url = require('url')
const path = require('path');
const { BrowserWindow, Menu, ipcMain } = require('electron');

const { app, BorwserWindow } = electron;

let mainWindow;
let addItemWindow;

// Set environment 
process.env.NODE_ENV='production';

// Call function when app is ready
app.on('ready', function () {

    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html file to the main window

    mainWindow.loadFile('mainWindow.html');

    // Quit app when closed 
    mainWindow.on('closed', () => {
        app.quit();
    });



    // Create main menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu into application menu
    Menu.setApplicationMenu(mainMenu);

});

// Create add item window handler
function createAddItemWindow() {

    // Create add item window
    addItemWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 400,
        height: 200,
        title: "Add New Item"
    });

    // Garbedge collection handler
    addItemWindow.on('close', () => {
        addItemWindow = null;
    });

    // Load html file to the main window
    addItemWindow.loadFile('addItemWindow.html');

}

// Receive add:item data
ipcMain.on('item:add', (e, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add',item);
    addItemWindow.close();
})

// Create menu template
const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Item",
                click() {
                    createAddItemWindow();
                }
            },
            {
                label: "Clear Items",
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
]

// Add empty object for MAC 
if (process.platform == "darwin") {
    mainMenuTemplate.unshift({});
}

// Add develper tool when app not pn production
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTool",
                accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
                click(item, focusedwindow) {
                    focusedwindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }

        ]

    })
}