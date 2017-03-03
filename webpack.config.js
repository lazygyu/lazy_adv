module.exports = {
    entry:{
        app:'./src/index.js'
    },
    output:{
        path:__dirname + '/dist',
        filename:'[name].wp.js'
    }
}