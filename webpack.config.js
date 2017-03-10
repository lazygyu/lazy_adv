const BabiliPlugin = require("babili-webpack-plugin");
module.exports = {
    entry:{
        app:'./src/index.js'
    },
    output:{
        path:__dirname + '/dist',
        filename:'[name].wp.js'
    },
    plugins: [
        new BabiliPlugin({ mangle: true }, {})
    ]
}