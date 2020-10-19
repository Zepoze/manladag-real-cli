options = require('../../../config/manladag.config')
module.exports.logDev = (...args) => {
    if(options.isDev) {
        console.log('======== Dev Log')
        console.log(...args)
        console.log('================')
    }
}