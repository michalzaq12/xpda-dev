import { Pipeline } from './Pipeline'

export async function cleanupAndExit(code?: number, exit?: boolean) {
  await Pipeline.stopAllPipelines()
  if (exit) process.exit(code)
}

// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

// exit param = false -> prevention of an infinite loop
process.on('exit', code => cleanupAndExit(code, false))

// catches ctrl+c event
process.on('SIGINT', () => cleanupAndExit(0))

// catches "kill pid"
process.on('SIGUSR1', () => cleanupAndExit(0))
process.on('SIGUSR2', () => cleanupAndExit(0))

// catches uncaught exceptions
process.on('uncaughtException', e => {
  console.log('Uncaught Exception')
  console.log(e.stack)
  cleanupAndExit(99)
})
