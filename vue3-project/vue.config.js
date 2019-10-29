const path = require('path');
const webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, dir);
}




module.exports = {
    publicPath: process.env.NODE_ENV === 'production'&&'/market/oralLanguage/'||'/',

    transpileDependencies: ['webpack-dev-server/client'],
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'articleExperience',
        },


    },
    devServer: {
        // proxy: {
        // }
    },
    css: {
        sourceMap: process.env.NODE_ENV === 'development',
    },
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('$root', resolve(''))
            .set('$public', resolve('public'))
            .set('$dist', resolve('dist'))
            .set('@assets', resolve('src/assets'))
            .set('@', resolve('src'));
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
};
