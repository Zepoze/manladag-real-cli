const isDev = process.env.NODE_ENV ==='development'
let options = 
{
    ui: {
        devPort: 8001
    },
    isDev
}

options.ui = 
{
    ...options.ui, 
    ...{
        hostBase : isDev ? `http://localhost:${options.ui.devPort}` : '/api'
    }
}

module.exports = options