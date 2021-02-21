const os = require('os')
if(os.platform() == 'linux')
  require('../dist/installation/manladagLib')
else {
  require('../dist/utils/getManagerInstalledLib').default().then((manager) => {
    const nconf = require('../dist/utils/getNconfData').getNconfDataJSON(manager)
    if(Object.keys(nconf.get()).length == 0) console.log('Any Manladags Libs are installed but dont worry run "manladag libs-settings" in order to install it :)')
  })
}