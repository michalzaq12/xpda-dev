export function onProcessExit(handler?: () => Promise<any>) {
  handler = handler || (() => Promise.resolve())

  async function onExit(code: number) {
    await handler()
    process.exit(code)
  }

  // listen event only once -> prevention of an infinite loop
  process.once('exit', code => onExit(code))

  // catches ctrl+c event
  process.once('SIGINT', () => onExit(0))

  // catches "kill pid"
  process.once('SIGUSR1', () => onExit(0))
  process.once('SIGUSR2', () => onExit(0))

  // catches uncaught exceptions
  process.once('uncaughtException', async e => {
    console.log('Uncaught Exception')
    console.log(e.stack)
    await onExit(99)
  })
}
