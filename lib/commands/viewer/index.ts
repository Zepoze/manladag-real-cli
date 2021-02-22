import yargs from 'yargs'
import builder from './builder'
const a:yargs.CommandModule = {

    command: 'viewer <cmd> [filename]',
    describe:'command  in order to view a .mlag file from manladag',
    builder,
    handler:() => yargs.showHelp()
}

export default a