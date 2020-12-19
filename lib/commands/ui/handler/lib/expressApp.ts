import express from 'express'
import Path from 'path'
import http from 'http'
import router from './expressRouter'
import initIo from './socketIo'

const App = express()
const server = http.createServer(App)
const isDev = process.env.NODE_ENV ==='development'
const Router = router(isDev)
initIo(server, isDev)
let c = Path.join(__dirname,'..','..','..','..','..','assets','UI','dist')

App.use(isDev ? '/' : '/api', Router)



if(process.env.NODE_ENV ==='development') {
    const options = require('../../../.././../config/manladag.config')
    
    App.use(function(req,res) {
        res.send('dev : bad request ')
    })
    server.listen(options.ui.devPort, function() {
        console.log('dev server for ui is listening on ', options.ui.devPort)
    })

} else {
    App.use(express.static(c))
    App.use(function(req,res) {
        res.send('ui : bad request ')
    })
}

export default server
