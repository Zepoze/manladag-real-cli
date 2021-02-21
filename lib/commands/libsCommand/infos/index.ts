import yargs from 'yargs'
import handler from './handler'
const a:yargs.CommandModule = {

    command: 'libs-infos',
    describe:'Prompt info of supported librairies',
    handler
}

export default a