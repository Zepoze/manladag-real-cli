import { PluginManager } from "live-plugin-manager";
import fs from 'fs'
import { getNconfDataJSON, PATH_TO_DATAJSON } from "../utils/getNconfData"

export function updateDataJSON(manager:PluginManager) {

  const nconfData = getNconfDataJSON()
  const errorSource:string[] = []

  manager.list().forEach((pluginInfo) => {
    try {
      const Lib = manager.require(pluginInfo.name).Source
      const siteKey = `${Lib.site.toLowerCase().split(' ').join('-')}`
      if(!nconfData.get(siteKey)) nconfData.set(`${siteKey}:mangas`, {})

      const LibmangaKeys = Object.keys(Lib.mangas)
      LibmangaKeys.forEach((ma) => {
        if(!nconfData.get(`${siteKey}:mangas:${ma}`)) nconfData.set(`${siteKey}:mangas:${ma}`, {})
      })

      const mangasDATAS = nconfData.get(`${siteKey}:mangas`)

      Object.keys(mangasDATAS).forEach(mk => {
        if(!LibmangaKeys.includes(mk)) {
          delete mangasDATAS[mk]
        }
      })

      nconfData.set(`${siteKey}:mangas`, mangasDATAS)

      nconfData.set(`${siteKey}:module`,pluginInfo.name)
    } catch(e) { errorSource.push(pluginInfo.name) }

  })

  const all = nconfData.get()
  const realInstalledLib = manager.list().map(pluginInfo => pluginInfo.name).filter( mod => !errorSource.includes(mod))


  Object.entries(nconfData.get() as { [key:string]: {module:string} }).forEach( ([site, { module }]) => {
    if(!realInstalledLib.includes(module)) delete all[site]
  })
  
  fs.writeFileSync(PATH_TO_DATAJSON, JSON.stringify(all))


}