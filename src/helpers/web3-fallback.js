const devchain = require('../commands/devchain')
const Web3 = require('web3')

const ensureWeb3 = async (network) => {
  let web3

  try {
    web3 = new Web3(network)
    const connected = await ctx.web3.eth.net.isListening()
    if (connected) return web3
  } catch (err) {
    throw new Error(`Please execute aragon run before running this`)
  }
}

module.exports = { ensureWeb3 }