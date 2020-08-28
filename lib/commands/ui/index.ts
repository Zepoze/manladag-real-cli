import yargs = require("yargs")
import builder from './builder'
import handler from './handler/index'
const a:yargs.CommandModule = {

    command: 'ui',
    describe: 'Manladag in Web Application',
    builder,
    handler
}

export default a