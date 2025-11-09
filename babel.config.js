module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
    //"@vue/app"
  ],
  // 'presets': [['es2015', {'modules': false}]],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      },
      "syntax-dynamic-import" // new add
    ]
  ]
}
