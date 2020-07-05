import yargs = require("yargs")
import serve from './commands/serve'
export default function(y:yargs.Argv<{}>): yargs.Argv<{}>{
    y.command(serve)
    .demandCommand(1)
    .strict()
    return y
}