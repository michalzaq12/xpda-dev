import { exec } from 'node:child_process';

/**
 * Natively and instantly kills the Electron process and all its subprocesses.
 * Ideal solution for development environments (eliminates delays during relaunch).
 */
export function killWithAllSubProcess(
  pid: number | undefined,
  warningOut: (text: string | Error) => void = console.warn
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!pid) return resolve();

    const isWindows = process.platform === 'win32';

    if (isWindows) {
      // /F - forcefully terminate the process
      // /T - terminate the specified process and any child processes which were started by it
      // /PID - specify the PID of the process to be terminated
      exec(`taskkill /F /T /PID ${pid}`, (error) => {
        if (error) {
          // Ignore the error if the process has already exited on its own
          const msg = error.message;
          if (!msg.includes('not found') && !msg.includes('nie znaleziono')) {
            warningOut(error);
          }
        }
        resolve();
      });
    } else {
      try {
        // On Unix/macOS, passing a negative PID kills the entire Process Group
        process.kill(-pid, 'SIGKILL');
      } catch (e: any) {
        if (e.code === 'ESRCH') {
          // Process does not exist anymore - ignore safely
          return resolve();
        }

        // Fallback: attempt to kill only the main process if PGID kill failed
        try {
          process.kill(pid, 'SIGKILL');
        } catch (err) {
          warningOut(err instanceof Error ? err : String(err));
        }
      }
      resolve();
    }
  });
}
