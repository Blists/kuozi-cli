### [更新记录](https://github.com/wenchao-pc/kuozi-cli/blob/vue-mobile/CHANGELOG.md)
### 使用说明
- 脚手架工具
	- github地址：https://github.com/Blists/yunye-cli
	- 使用方法
	- 项目模板：vue-mobile、vue-desktop-router、vue-desktop-tab

- 项目框架
	-  构建webpack+gulp
		- gulp启动webpack
		- 项目参数配置环境选择
		- 项目打包部署 
	- 使用技术
		- vue全家桶（vue+vue-router+vuex）
		-  MintUI（移动端)）Element（wms）
		- 其他：lodash、FastClick、store、moment
	- 目录结构
		- config 项目配置
			1. env.xxx.js:开发环境代配置proxyServer/环境相关变量配置
			2. project.js project.less project.variables：不同环境js、css、less常亮配置
			3. ssh.js 项目部署ssh配置
		- asset 资源
		- components 项目内组件
			项目布局组件UiLayout.vue UiContainer.vue
		- directive 自定义指令
		- filter 自定义过滤器
			1. 时间格式化过滤器dateFmt、strDateFmt
			2. 数字格式化过滤器numFmt
		- mixin 全局混合/局部混合
			1. Store:本地存储操作api
			2. \$get/\$post/\$getDirect/\$postDirect ajax请求方法
			3. \$to/\$back 路由跳转/返回方法
			4. \$loading/\$loaded 加载中/加载完毕方法
			5. forward.js:局部混合 页面跳转逻辑处理
		- router 路由配置
			1. 路由根据view目录结构生成配置
			2. loginIntercept.js页面登录控制配置
		- store vuex相关
		- style 样式
			1. style.less：重置样式
			2. common.less：通用样式
			3. variables.sre.less：less变量配置variables.less由variables.sre.less生成
		- utils 工具类
			1. constants.js项目常量配置
			2. fetch.js ajax请求方法封装
			3. math.js 解决js浮点型运算精度丢失bug
			4. urls.js ajax请求url配置
		- view页面
			支持自动生成嵌套路由：文件夹和文件同名

		
