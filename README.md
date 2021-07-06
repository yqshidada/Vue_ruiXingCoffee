# ruiXingCoffee
VueProject

```txt
安装vant
npm i vant --save
--save 简写 -S
--save-dev 简写 -D

配置按需导入vant组件
安装babel-plugin-import
npm i babel-plugin-import --save-dev


配置px转rem
安装postcss-pxtorem
安装lib-flexible

npm i postcss-pxtorem lib-flexible --save-dev

在项目根目录创建postcss.config.js, 然后写入以下代码
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
    },
  },
};

除此以外, 还需要再main.js写入以下代码
将px转rem文件
import 'lib-flexible/flexible'
```

```txt
vscode 快速生成vue组件插件
Vue VSCode Snippets

插槽简写
v-slot:插槽名称="插槽作用域变量名称"
#插槽名称="插槽作用域变量名称"

如果没有插槽作用域变量名称
v-slot:插槽名称 或者 #插槽名称
```

```txt
主题色
#0C34BA
```


```txt
安装vant
  cnpm i vant -S

安装按需导入vant组件插件
  cnpm babel-plugin-import --save-dev

在babel.config.js文件添加以下代码
  module.exports = {
    plugins: [
      ['import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      }, 'vant']
    ]
  }

在main.js写入以下代码
  导入vant框架的组件
  import { Button } from 'vant'

  全局注册
  Vue.use(Button)

测试Button组件
  <van-button type="info">信息按钮</van-button>
```

```
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
