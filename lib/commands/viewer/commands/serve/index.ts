import yargs from 'yargs'
import builder from './builder'

const a:yargs.CommandModule = {
    command:'serve <files..>',
    describe: 'Serve given files into a web server',
    builder,
    handler: (argv) => require('./handler/index').run(argv)

}

export default a