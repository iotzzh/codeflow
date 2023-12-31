import { ipcMain } from "electron";

const modules = import.meta.glob('./*.ts');

export const addMessageListener = async () => {
    for (const path in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, path)) {
            const module: any = await modules[path]();
            const keys = Object.keys(module);
            keys.forEach((x: any) => {
                try {
                    if (typeof module[x] !== 'function') return;
                    if (module.default?.prefix) {
                        ipcMain.on(`${module.default.prefix + ':' + x}`, module[x])
                    } else {
                        ipcMain.on(x, module[x]);
                    }

                } catch (err) {
                    console.log(err);
                }
            });
        }
    }
};