export default async function(argv: {
  [argName: string]: unknown;
  _: string[];
  $0: string;
}) {
  const chalk = require('chalk')
  const supportedLib = require('../../../installation/SupportedLib/index').default as SupportedLib[]
  supportedLib.map((sp) => {
    console.log(`${chalk.blueBright("==========================")}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Name')} : ${chalk.whiteBright(sp.name)}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Website')} : ${chalk.whiteBright(sp.url)}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Lang')} : ${chalk.whiteBright(sp.lang.join(', '))}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Author')} : ${chalk.whiteBright(sp.author)}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Module')} : ${chalk.whiteBright(sp.module)} ${sp.minVersion}`)
    console.log(`${chalk.blueBright('== ')} ${chalk.redBright('Description')} : ${chalk.whiteBright(('\n'+sp.description).split('\n').join('\n'+chalk.blueBright('==\t')))}\n`)
  })
  process.exit(0)



}