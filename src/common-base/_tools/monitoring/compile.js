/*
 * @Author: liwenjie liwenjie@lonch.com.cn
 * @Date: 2024-04-25 10:48:33
 * @LastEditors: liwenjie liwenjie@lonch.com.cn
 * @LastEditTime: 2024-06-13 16:45:50
 * @FilePath: \common-basec:\project\middleground\lonch-pwms\src\common-base\_tools\monitoring\compile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const { minify } = require('terser');

/**
 * html-webpack-plugin事件添加钩子，用于压缩资源监控页面
 */
class CustomHtmlPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CustomHtmlPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'CustomHtmlPlugin',
        async (data, cb) => {
          /**
           * 获取资源监控文件
           */
          const context = fs.readFileSync(
            './src/common-base/_tools/monitoring/resources.js',
            'utf8'
          );

          // // 在这里你可以修改 data.html，添加或修改内容
          // data.html = data.html.replace(
          //   '</title>',
          //   `</title>\n<script>${context}</script>`
          // );

          // // 调用 cb 继续处理
          // cb(null, data);
          // return

          /**
           * 压缩资源监控文件
           */
          const result = await minify(context);
          let resourcesContext = result.code;

          // 压缩报错，不压缩添加
          if (result.error) {
            resourcesContext = context;
            cb(null, data);
          }

          /**
           * html添加资源监控代码
           */
          data.html = data.html.replace(
            '</title>',
            `</title>\n<script>${resourcesContext}</script>`
          );

          // 调用 cb 继续处理
          cb(null, data);
        }
      );
    });
  }
}

function configureWebpack(config) {
  config.plugins.push(new CustomHtmlPlugin());
}

module.exports = configureWebpack
