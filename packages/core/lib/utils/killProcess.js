"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killWithAllSubProcess = void 0;
const node_child_process_1 = require("node:child_process");
function killWithAllSubProcess(pid, warningOut = console.warn) {
    return new Promise((resolve) => {
        if (!pid)
            return resolve();
        const isWindows = process.platform === 'win32';
        if (isWindows) {
            (0, node_child_process_1.exec)(`taskkill /F /T /PID ${pid}`, (error) => {
                if (error) {
                    const msg = error.message;
                    if (!msg.includes('not found') && !msg.includes('nie znaleziono')) {
                        warningOut(error);
                    }
                }
                resolve();
            });
        }
        else {
            try {
                process.kill(-pid, 'SIGKILL');
            }
            catch (e) {
                if (e.code === 'ESRCH') {
                    return resolve();
                }
                try {
                    process.kill(pid, 'SIGKILL');
                }
                catch (err) {
                    warningOut(err instanceof Error ? err : String(err));
                }
            }
            resolve();
        }
    });
}
exports.killWithAllSubProcess = killWithAllSubProcess;
