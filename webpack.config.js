var webpack = require('webpack');
module.exports = {
    entry:{
        app:'./src/index.js'
    },
    output:{
        path:__dirname + '/dist',
        filename:'[name].wp.js'
    },
    plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}