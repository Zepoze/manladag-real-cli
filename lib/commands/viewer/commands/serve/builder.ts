import yargs from 'yargs'
import Path from 'path'
import fs from 'fs'

function removeDups(names:string[]) {
    let unique:{[key:string]: boolean} = {};
    names.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

export default function(y:yargs.Argv<{}>): yargs.Argv<{}>{
    y.option({
        'port': {
            alias:'p',
            desc: 'serve on given port',
            type: 'number',
            default: 1854
        }
    })
    .positional("files", {
        describe:'mlag files to serve',
        coerce:(input) => {
            return input.map((e:string)=>{
                return Path.resolve(process.cwd(), e)
            })
        }
    })
    .check((argv) => {
        const files = argv["files"]
        files.forEach((file:string) => {
            if(!fs.existsSync(file)) throw new Error(`The file ${file} doesn't exist`)
            if(fs.lstatSync(file).isFile()) {
                if(Path.extname(file)!= '.mlag') throw new Error(`The file ${file} looks not a manladag file`)
            } else {
                const subFiles = fs.readdirSync(file).filter((f) => {
                    return Path.extname(f) == '.mlag'
                })
                .map((f) => {
                    return Path.resolve(file,f)
                })
                argv["files"] = [...subFiles, ...argv["files"]]
            }
        })
        argv["files"] = argv["files"].filter((f:string) => {
            return fs.lstatSync(f).isFile()
        })

        argv["files"] = removeDups(argv["files"])

        if(argv["files"].length == 0) throw new Error('no files in input')

        return true
    })
    .group(['port'], "Server options")
    return y
}