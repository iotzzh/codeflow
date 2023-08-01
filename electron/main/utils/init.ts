import { app, BrowserWindow, shell, ipcMain, screen, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import WindowHelper from './windowHelper'

export default class Init {
    static initProcess() {
        process.env.DIST_ELECTRON = join(__dirname, '..')
        process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
        process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
            ? join(process.env.DIST_ELECTRON, '../public')
            : process.env.DIST

        // Disable GPU Acceleration for Windows 7
        if (release().startsWith('6.1')) app.disableHardwareAcceleration()

        // Set application name for Windows 10+ notifications
        if (process.platform === 'win32') app.setAppUserModelId(app.getName())

        if (!app.requestSingleInstanceLock()) {
            app.quit()
            process.exit(0)
        }

        // Remove electron security warnings
        // This warning only shows in development mode
        // Read more on https://www.electronjs.org/docs/latest/tutorial/security
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    };


    static initAPP() {
        app.whenReady().then(() => {
            globalThis.mainWindow = WindowHelper.createWindow();
          })
          
          app.on('window-all-closed', () => {
            globalThis.mainWindow = null
            if (process.platform !== 'darwin') app.quit()
          })
          
          app.on('second-instance', () => {
            if (globalThis.mainWindow) {
              // Focus on the main window if the user tried to open another
              if (globalThis.mainWindow.isMinimized()) globalThis.mainWindow.restore()
              globalThis.mainWindow.focus()
            }
          })
          
          app.on('activate', () => {
            const allWindows = BrowserWindow.getAllWindows()
            if (allWindows.length) {
              allWindows[0].focus()
            } else {
                globalThis.mainWindow = WindowHelper.createWindow();
            }
          })
    };
}