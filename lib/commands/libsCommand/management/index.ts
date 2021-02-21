import yargs from 'yargs'
import handler from './handler'
const a:yargs.CommandModule = {

    command: 'libs-settings',
    describe:'install/uninstall/update Manldag Librairies',
    handler
}

export default a
