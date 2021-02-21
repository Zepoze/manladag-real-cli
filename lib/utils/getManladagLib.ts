import { PluginManager } from 'live-plugin-manager'
import lazy from 'import-lazy'

function _getManladagLib(manager:PluginManager) {
  const modules = manager.list().map(pl => pl.name)
  let alias:{[key:string]: string} = {} ;
  (require('../installation/SupportedLib/index').default as SupportedLib[]).filter((sp) => {
    return modules.includes(sp.module)
  }).forEach((sp)=> {
    alias[sp.name.toLowerCase().split(' ').join('-')] = sp.module
  })

  return function(moduleName:string) {
    return manager.require(modules.includes(moduleName) ? moduleName : alias[moduleName.toLowerCase().split(' ').join('-')]) as { Source:source }
  }
}

function _lazyManladagLib(manager:PluginManager) {
  const importLazy = lazy(manager.require.bind(manager))
  const modules = manager.list().map(pl => pl.name)
  let alias:{[key:string]: string} = {} ;
  (require('../installation/SupportedLib/index').default as SupportedLib[]).filter((sp) => {
    return modules.includes(sp.module)
  }).forEach((sp)=> {
    alias[sp.name.toLowerCase().split(' ').join('-')] = sp.module
  })

  return function(moduleName:string) {
    return importLazy(modules.includes(moduleName) ? moduleName : alias[moduleName.toLowerCase().split(' ').join('-')]) as { Source:source }
  }
}

export function getManladagLib(manager:PluginManager, lazy?:boolean) {
  if(lazy) return _lazyManladagLib(manager)
  else return _getManladagLib(manager)
}

export function getAllManladagLibs(manager:PluginManager): {[key:string]: source} {
  const getLazy = _lazyManladagLib(manager)
  const modules = manager.list().map(pl => pl.name)
  let alias:{[key:string]: string} = {} ;
  (require('../installation/SupportedLib/index').default as SupportedLib[]).filter((sp) => {
    return modules.includes(sp.module)
  }).forEach((sp)=> {
    alias[sp.name.toLowerCase().split(' ').join('-')] = sp.module
  })

  let moduleLib = {}
  modules.forEach((mod) => {
    Object.defineProperty(moduleLib, mod, {
      writable: false,
      value: getLazy(mod),
    })
  })

  const handler:ProxyHandler<{ [key:string] : source}> = {
    get:(target, property) => {
      return Reflect.get(moduleLib,modules.includes(property.toString()) ? property : alias[property.toString().toLowerCase().split(' ').join('-')]).Source
    }
  }
  

  return new Proxy(function() {} as {}, handler)

}
