import * as psTree from 'ps-tree'

export function killProcess(pid: number, warningOut: (text: string | Error) => void = console.warn) {
  try {
    process.kill(pid)
  } catch (e) {
    // ESRCH = The process has already been killed.
    if (e.code !== 'ESRCH') warningOut(e)
  }
}

export function killWithAllSubProcess(pid: number, warningOut: (text: string | Error) => void = console.warn) {
  return new Promise((resolve, reject) => {
    psTree(pid, (err, children) => {
      if (err) reject(err)
      children.forEach(p => {
        killProcess(parseInt(p.PID), warningOut)
      })
      killProcess(pid, warningOut)
      resolve()
    })
  })
}
