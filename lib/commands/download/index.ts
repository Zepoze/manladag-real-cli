import yargs = require("yargs")
import builder from './builder'
import handler from './handler'
const a:yargs.CommandModule = {

    command: 'download [path]',
    describe:'download a chapter of given source and manga',
    builder,
    handler
}

export default a
