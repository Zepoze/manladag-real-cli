import SupportedLib from '../installation/SupportedLib'
import Path from 'path'
import { PluginManager } from 'live-plugin-manager'

const dirS = Path.join(__dirname,'..','..','.libs')

export default async function() {
  const manager = new PluginManager({ cwd: dirS, pluginsPath: dirS })
  for(let i =0 ;i<SupportedLib.length;i++){
    try { 
      await manager.installFromPath(Path.join(dirS, ...SupportedLib[i].module.split('/')))
    } catch {}
  }
  return manager
}