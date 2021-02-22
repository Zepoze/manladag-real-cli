import yargs = require("yargs")
import builder from './builder'
const a:yargs.CommandModule = {

    command: 'download [path]',
    describe:'download a chapter of given source and manga',
    builder,
    handler: (argv) => require('./handler').run(argv)
}

export default a
