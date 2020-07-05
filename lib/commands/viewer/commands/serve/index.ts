import yargs from 'yargs'
import builder from './builder'
import handler from './handler/index'

const a:yargs.CommandModule = {
    command:'serve <files..>',
    describe: 'Serve given files into a web server',
    builder,
    handler

}

export default a