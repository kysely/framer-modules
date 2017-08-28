const path = require('path')

module.exports = {
    entry: './src/interface/App.js',

    output: {
        path: path.resolve('app', 'interface'),
        publicPath: "/app/interface/",
        filename: 'interface.bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader']
            },
            {
                test: /\.sass$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    }
}
