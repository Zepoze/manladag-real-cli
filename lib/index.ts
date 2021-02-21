import yargs from 'yargs'
import download from './commands/download'
import viewer from './commands/viewer'
import libsSettings from './commands/libsCommand/management'
import libsInfo from './commands/libsCommand/infos'

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    })
  
    rl.on("SIGINT", function () {
      process.emit("SIGINT", "SIGINT")
    })
  
  }


yargs
    .demandCommand(1)
    .command(download)
    .command(viewer)
    .command(libsSettings)
    .command(libsInfo)
    .strict()
    .help()
    .argv