# ruiXingCoffee
VueProject

```
该项目使用的技术
vue + vantUI + axios

启动项目
1.下载依赖
  npm install
2.运行
npm run serve

配置rem, px自动转换rem

安装 postcss-pxtorem、lib-flexible插件
  cnpm i postcss-pxtorem lib-flexible --save-dev

在项目根目录创建postcss.config.js文件，写入一下内容
  module.exports = {
    plugins: {
      autoprefixer: {
        browsers: ['Android >= 4.0', 'iOS >= 8'],
      },
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*']
      },
    }
  }

在main.js导入lib-flexible.js
  import 'lib-flexible/flexible'
