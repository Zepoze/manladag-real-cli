import nconf from 'nconf'
import path from 'path'
import rimraf from 'rimraf'
import fs from 'fs'
import { PluginManager } from 'live-plugin-manager'

import { updateDataJSON } from '../installation/updateLibsData'

const pathDATADIR = path.join(__dirname,'..','..')

export const PATH_TO_DATAJSON = path.join(pathDATADIR,'data.json')

function createNewDataFile(pathTofile:string) {
  fs.writeFileSync(pathTofile, '{}')
}

function _(keyName:'data') {
  const pathToFile = path.join(pathDATADIR,`${keyName}.json`)

  if(nconf.stores[keyName]) return nconf.stores[keyName] as nconf.Provider

  if(!fs.existsSync(pathToFile)) {
    createNewDataFile(pathToFile)
  } else if(fs.lstatSync(pathToFile).isDirectory()) {
    rimraf.sync(pathToFile)
    createNewDataFile(pathToFile)
  } else {
    try {
      JSON.parse(fs.readFileSync(pathToFile).toString())
    }
    catch {
      createNewDataFile(pathToFile)
    }
  }
  nconf.add(keyName, { type: 'file', file: pathToFile })
  return nconf.stores[keyName] as nconf.Provider
}



/**
 * @function getNconfDataJSON
 * @param manager 
 * update /path/to/dir/data.json with installed libs from manager
 */
export function getNconfDataJSON(manager?:PluginManager) {
  const n = _("data")
  if(manager) updateDataJSON(manager)
  return n
}
