const commonCDNConfig = require('../common-base/config/common-cdn-config.js');
const config = {
  css: [
    '/global.css',
    '/element-ui-2.13.0.css',
    '/vue-treeselect.min-v0.4.0.css'
  ],
  js: [
    '/vue@2.6.11.js',
    '/vue-router@3.4.9.js',
    '/axios@0.21.0.js',
    '/element-ui@2.13.0-base.js',
    '/jweixin-1.3.2.js',
    '/canvas.js',
    '/decPorsion.js',
    '/global.js'
  ]
};
const cdnConfig = Object.assign({}, config, commonCDNConfig[process.env.VUE_APP_CDN]);
module.exports = cdnConfig;
