import yargs from 'yargs'
import download from './commands/download'
import viewer from './commands/viewer'

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
    .strict()
    .help()
    .argv
