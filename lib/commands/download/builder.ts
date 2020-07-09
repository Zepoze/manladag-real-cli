import yargs = require("yargs");
import Path from 'path'
import nconf from 'nconf'
import fs from 'fs'

nconf.file(Path.join(__dirname,'..','..','..','data.json'))

export default function(y:yargs.Argv<{}>): yargs.Argv<{}>{
    y.positional('path', {
        desc: 'filename or directorie the chapter will be downloaded',
        type: 'string',
        default: '.',
        defaultDescription: 'Current working dir',
        coerce:(input:string) => {
            return Path.resolve(process.cwd(),input)
        }
    })
    .options({
        'source': {
            alias: 's',
            describe: 'provide a source',
            choices: Object.keys(nconf.get())
        },
        'manga': {
            alias: 'm',
            describe: 'provide a manga',
        },
        'chapter': {
            alias: 'c',
            desc: 'give the chapter to download',
            type: 'number'
        }
    })
    .check((argv, options) => {

        if(argv["path"] == Path.join('/') || Path.join('/') == Path.join(argv["path"],'..')) throw new Error('Dont download on the root')

        if(fs.existsSync(argv["path"])) {
            if(fs.lstatSync(argv["path"]).isFile()) throw new Error(`${argv["path"]} is file which already exist`)
        } else {
            if(!fs.existsSync(Path.join(argv["path"], '..'))) throw new Error(`The directorie ${Path.join(argv["path"],'..')} doesn't exist`)
        }

        if(!nconf.get(`${argv['source']}`)) {
            throw new Error(`the source "${argv['source']}" doesn't available choose one in : ${Object.keys(nconf.get()).toString()}`)
        }

        if(!nconf.get(`${argv['source']}:mangas:${argv['manga']}`)) {
            throw new Error(`the manga "${argv['manga']}" doensn't exist in ${argv['source']} choose one in : ${Object.keys(nconf.get(argv['source']+':mangas')).toString().replace(/, ?/g, '\n')}`)
        }
        return true
    })
    .demandOption(['manga','chapter','source'])
    .strict()
    return y
}