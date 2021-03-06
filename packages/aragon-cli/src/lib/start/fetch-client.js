import path from 'path'
import { copy, existsSync, ensureDirSync } from 'fs-extra'
import os from 'os'

export async function fetchClient(ctx, task, clientVersion) {
  ctx.clientFetch = true
  ctx.clientAvailable = true

  const CLIENT_PATH = `${os.homedir()}/.aragon/client-${clientVersion}`
  ctx.clientPath = CLIENT_PATH

  // Make sure we haven't already downloaded the client
  if (existsSync(path.resolve(CLIENT_PATH))) {
    task.skip('Client already fetched')
    return
  }

  // Get prebuild client from aragen
  const files = path.resolve(
    require.resolve('@aragon/aragen'),
    '../ipfs-cache',
    '@aragon/aragon'
  )

  // Ensure folder exists
  const BUILD_PATH = path.join(CLIENT_PATH, 'build')
  ensureDirSync(BUILD_PATH)

  // Copy files
  await copy(files, BUILD_PATH)
}
