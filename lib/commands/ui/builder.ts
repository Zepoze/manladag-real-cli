import yargs = require("yargs");
import Path from 'path'
import nconf from 'nconf'
import fs from 'fs'

nconf.file(Path.join(__dirname,'..','..','..','data.json'))

export default function(y:yargs.Argv<{}>): yargs.Argv<{}>{
    return y
}