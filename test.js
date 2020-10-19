
const findCacheDir = require('global-cache-dir');
 findCacheDir('manladag-cli2').then((n) => {
     console.log(n)
 })