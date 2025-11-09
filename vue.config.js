/* eslint-disable no-console */
const path = require('path');
//const webpack=require('webpack')
//const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const CompressionWebpackPlugin = require('compression-webpack-plugin');
//const productionGzipExtensions = ['js', 'css'];
//const isProduction = process.env.NODE_ENV === 'production' ? true : false;
const outputDir = 'dist';
const cdnConfig = require('./src/config/cdn-config');
const monitoringCompile = require('./src/common-base/_tools/monitoring/compile.js');
//console.log('__dirname:', __dirname);
module.exports = {
  publicPath: './',
  outputDir: outputDir,
  assetsDir: 'assets',
  indexPath: 'index.html',
  filenameHashing: true,
  pages: undefined,
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: false,
  crossorigin: '',
  integrity: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].cdnConfig = cdnConfig;
      return args;
    });
  },
  //configureWebpack: {
  //  externals: {
  //    'vue': 'Vue',
  //    'vue-router': 'VueRouter',
  //    'axios': 'axios',
  //    'element-ui': 'ELEMENT',
  //    'html2canvas-ui': 'html2canvas'
  //  },
  //  output: {
  //    path: path.resolve(__dirname, 'dist'),
  //    filename: '[name]-[hash:8].js',
  //    chunkFilename: 'js/[name]-[hash:8].js'
  //  }
  //},
  configureWebpack: config => {
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
      'html2canvas-ui': 'html2canvas'
    };
    if(process.env.NODE_ENV !== 'development'){
      config.output.filename = '[name]-[hash:8].js';
      config.output.chunkFilename = 'js/[name]-[hash:8].js';
    }
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: __dirname + '/src/common-base/static',
            to: process.env.NODE_ENV === 'development'?'./static/':__dirname + '/dist/static/',
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: [
                '**/src/@(dev|production|test)/**',
                '**/src/*.txt'
              ]
            }
          }
      ]
    }));
    monitoringCompile(config);
    //config.output.filename = 'js/[name].[hash].js'
    //config.output.chunkFilename = 'js/[name]-[hash:8].js'
  },
  //configureWebpack: config => {
  //  //if (isProduction) {
  //  //  config.plugins.push(new CompressionWebpackPlugin({
  //  //    algorithm: 'gzip',
  //  //    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  //  //    threshold: 10240,
  //  //    minRatio: 0.8
  //  //  }))
  //  //}
  //  config.externals = {
  //    'vue': 'Vue',
  //    'vue-router': 'VueRouter',
  //    'axios': 'axios',
  //    'element-ui': 'ELEMENT',
  //    'html2canvas-ui': 'html2canvas'
  //  };
  //  config.output = {
  //    path: path.resolve(__dirname, 'dist'),
  //    filename: '[name]-[hash:8].js',
  //    chunkFilename: 'js/[name]-[hash:8].js'
  //  };
  //  return config
  //},
  devServer: {
    hot: true, // 设置代码保存时是否进行热更新（局部刷新，不刷新整个页面）
    open: false, // 设置 server 启动后是否自动打开浏览器
    //代理
    // host: process.localhost,
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT || '8082',
    https: true,
    compress: true, // 开启 gzip 压缩
    client: {
      overlay: false, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    },
    //contentBase: './content'
    // host: 'local-manageaurora.lonch.com.cn',//target host
    //proxy: {
    //  '/rng': {     //这里最好有一个 /
    //    target: 'https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb',  // 后台接口域名
    //    ws: true,        //如果要代理 websockets，配置这个参数
    //    secure: false,  // 如果是https接口，需要配置这个参数
    //    changeOrigin: true,  //是否跨域
    //    pathRewrite: {
    //      '^/rng': ''
    //    }
    //  }
    //}
  }
};
