/// <reference path="./SupportedLib/SupportedLib.d.ts" />

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import SupportedLib from './SupportedLib'
import getPluginManager from './../utils/getManagerInstalledLib'

import { getNconfDataJSON } from './../utils/getNconfData'
import { updateAll }  from './updateLibsData'
import Listr from 'listr'

async function go() {
  //PRE LOADING
  let spinner = ora('reload data files ...').start()
  const manager = await getPluginManager()
  getNconfDataJSON(manager)
  spinner.text ='Done !'
  spinner.succeed()

  const installedLibs: {name:string, version:string}[] = manager.list()
  const choices1 = getChoices1(installedLibs)

  const answer1 = await inquirer.prompt([
    { 
      name: 'action',
      type: 'list',
      message: 'Manage manladag libraries ',
      choices: choices1
      
    }
  ])
  
  if(answer1.action == 0) process.exit(0)
  
  const { libs } = await inquirer.prompt([
    {
      name:'libs',
      type: answer1.action == 3 ? 'list' :'checkbox',
      message: `Choose lib(s) to ${answer1.action == 3 ? 'Update' : ((answer1.action == 2 ? 'un': '')+'install')}`,
      choices: SupportedLib.filter((sp) => answer1.action == 1 ? !installedLibs.map(il => il.name).includes(sp.module) : installedLibs.map(il => il.name).includes(sp.module))
      .map(sp => ({ name: sp.name+(sp.recommended && answer1.action ==1 ? ' (recommended)':''), value: sp }))
    }
  ])
  let modules:{mod:string, minVersion:string}[] =[]
  if(answer1.action != 3) modules = libs.map((sp:any) => ({ mod: sp.module, minVersion: sp.minVersion }))

  let ListrTasks:Listr.ListrTask<any>[] | undefined = undefined

  if(answer1.action == 1 && modules.length >0) {

    const installLib = async function (name:string, minVersion:string) {
      try {
        await manager.installFromNpm(name,minVersion)
        return chalk.blueBright(name)+' installed !'
      } catch {
        throw new Error('Impossible to install '+ chalk.blueBright(name)+' ??')
      }
    }
    
    ListrTasks = modules.map(({mod,minVersion }) => {
      return { title: `Installation of ${mod} from npm`, task:()=> installLib(mod,minVersion) }
    })

  }
  if(answer1.action == 2 && modules.length >0) {

    const uninstallLib = async function (name:string) {
      try {
        await manager.uninstall(name)
        return chalk.blueBright(name)+' uninstalled !'
      } catch {
        throw new Error('Impossible to uninstall '+ chalk.blueBright(name)+' ??')
      }
    }

    ListrTasks = modules.map(({mod}) => {
      return { title: `Uninstallation of ${mod} from npm`, task:()=> uninstallLib(mod) }
    })

  }

  if(answer1.action == 3) {
    const { version } =  await inquirer.prompt([
      {
        name:'version',
        message:'Type a version to install',
        type: 'input',
        validate:(el) => {
          const tabVersion:string[] = el.split('.')
          if(tabVersion.filter( nb => parseInt(nb) >= 0 ).length == tabVersion.length && tabVersion.length == 3) return true
          else return 'Need to be a String  of a valid semantic version ! (example : 0.21.3 ; 21.8.2 ; 2.0.9)'
        },
        default: libs.minVersion
      }
    ])

    let Bool = false
    const tabV:number[] = (version  as string).split('.').map( nb => parseInt(nb))
    const tabminVersion:number[] = (libs.minVersion as string).split('.').map( nb => parseInt(nb))

    if(tabV[0] < tabminVersion[0]) Bool = true
    if(!Bool) for(let i =0;i<tabV.length;i++) {
      if(tabV[i] > tabminVersion[i]) break
      if(tabV[i] == tabminVersion[i] && i != tabV.length-1) {
        if(tabV[i+1] < tabminVersion[i+1]) {
          Bool = true
          break
        }
      }
    }



    if(Bool) Bool = !await inquirer.prompt([
    {
      name:'validate',
      message: 'This version is lower than the recomended minimum version : '+ libs.minVersion+'\nInstall this version anyway ?',
      type:'confirm',
      default: false,
    }])




    console.log(Bool)

    if(!Bool) {
      const installLib = async function (name:string, version:string) {
        try {
          await manager.installFromNpm(name,version)
          return chalk.blueBright(name)+' installed !'
        } catch {
          throw new Error('Impossible to install '+ chalk.blueBright(name)+version+' ??')
        }
      }
      ListrTasks = [
        { title: `installation of ${libs.module} ${version} from npm`, task:()=> installLib(libs.module, version) }
      ]
    }
  }
  
  
  if(ListrTasks) new Listr([{ title: 'Libs '+(answer1.action ==1 ? 'Installation': (answer1.action ==2 ? 'Uninstallation': 'Update')),task: ()=> new Listr(ListrTasks, { concurrent: true })}, {title: 'Save files data', task: () => updateAll(manager)}]).run()

  
}

function getChoices1(installedL:{ name:string, version:string}[]) {
  const choices = []


  if(installedL.length < SupportedLib.length) choices.push({ name:'Installations', value: 1 })
  if(installedL.length>0) choices.push(...[{ name: 'Uninstallations', value: 2 }, { name:'Updates', value: 3 }])
  choices.push({ type:'separator'})
  choices.push({ name:'Exit', value: 0 })
  return choices
}

go()
