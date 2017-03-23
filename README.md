<div align="center">
  <img width="200" height="200"
    src="https://worldvectorlogo.com/logos/html5.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://worldvectorlogo.com/logos/webpack.svg">
  </a>
  <h1>Css-Id-Replace Loader</h1>
  <p>Another solution to CSS Module<p>
</div>

<h2 align="center">安装</h2>

```bash
npm i -D cssidreplace-loader
```

<h2 align="center">前言</h2>

讲一下我司的另一种css模块化解决方案，给每个模块自定义一个css key，比如说`customHeader`，在该模块的所有css样式签名都套上.customHeader  
e.g.这是模块html文件
```html
<header>
	<h1>this is header</h1>
	<p>css模块化解决方案</p>
</header>
```
以下是该模块css代码
```css
.customHeader header{
	width: 990px;
	margin: 10px auto;
}
.customHeader h1{
	font-style: italic;
}
.customHeader p{
	color: #ccc;
}
```
webpack打包的时候给该模块css key添加一个随机唯一的数值生成最终的cssId，e.g.customHeader-123456，生成最终文件代码如下：
```html
<style type="text/css">
.customHeader-123456 header{
	width: 990px;
	margin: 10px auto;
}
.customHeader-123456 h1{
	font-style: italic;
}
.customHeader-123456 p{
	color: #ccc;
}
</style>
<div class="customHeader-123456">
	<header>
		<h1>this is header</h1>
		<p>css模块化解决方案</p>
	</header>
</div>
```

<h2 align="center">用法</h2>

cssidreplace-loader的作用就是在webpack打包时把css代码中的css key替换成css Id（即是把customHeader替换成customHeader-123456）。  
可配置参数有两个：`regex`和`sub`，`regex`指待替换css key，`sub`指css Id，在webpack配置文件中代码如下：
```js
{
  test: /\.css$/,
  use: [
	{
	  loader: "style-loader"
	},
	{
	  loader: "css-loader"
	},
	{
	  loader: 'cssidreplace-loader',
	  options: {
	    regex: 'customHeader',
	    sub: 'customHeader-123456'
	  }
	}
  ]
}
```
每个模块的css Id都是不同的，咱们可以通过通过动态配置webpack给对应的模块替换上相应的css Id
```js
// 注意：默认模块名称跟模块文件夹名称是一致的
// var modulesMap = [  // 举例，假设这个是所有模块的索引
//     {
//         name: 'header', // 模块名称
//         cssKey: 'customHeader',
//         cssId: 'customHeader-123456'
//     },
//     {
//         name: 'footer',
//         cssKey: 'customFooter',
//         cssId: 'customFooter-323122'
//     },
// ];
const webpack = require('webpack');
const webpack_config = require('./webpack.config');
const webpackDevServer = require('webpack-dev-server');
modulesMap.forEach((module) => {
  webpack_config.module.rules.unshift({
    test: eval("/\.css$/i"),
    include: eval(module.name),
    use: [
      	{
      	  loader: "style-loader"
      	},
      	{
      	  loader: "css-loader"
      	},
      	{
      	  loader: 'cssidreplace-loader',
      	  options: {
      	    regex: module.cssKey,
      	    sub: module.cssId
      	  }
      	}
    ]
  });
});
//webpack dev server
const compiler = webpack(webpack_config);
new webpackDevServer(compiler, {
  stats: {
    colors: true,
    chunks: false
  },
  noInfo: false,
  proxy: {
    '*': {
      target: 'http://localhost:3000',
    }
  }
}).listen(8080, function(){console.log('App (dev) is now running on port 8080!');});
```