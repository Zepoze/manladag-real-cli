import yargs from 'yargs'
import download from './commands/download'
import viewer from './commands/viewer'
import ui from './commands/ui'

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
    .command(ui)
    .strict()
    .help()
    .argv
