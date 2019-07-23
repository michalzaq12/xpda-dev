import * as psTree from 'ps-tree'

export function killProcess (pid, warningOut = console.warn) {
  try {
    process.kill(pid)
  } catch (e) {
    // ESRCH = The process has already been killed.
    if (e.code !== 'ESRCH') warningOut(e)
  }
}

export function killWithAllSubProcess (pid, warningOut = console.warn) {
  return new Promise((resolve, reject) => {
    psTree(pid, (err, children) => {
      if (err) reject(err)
      children.forEach(p => {
        killProcess(p.PID, warningOut)
      })
      killProcess(pid, warningOut)
      resolve()
    })
  })
}
