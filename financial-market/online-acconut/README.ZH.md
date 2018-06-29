 ---
## ant-mobile-minimize项目模版文档
---

> 作者：支付产品中心--黄思鑫

> 内部仓库: git: http://gerrit.99bill.net/#/admin/projects/mkt/react-frame7-template

> github: https://github.com/Roxyhuang/ant-mobile-minimize

### 1.How to start

####（1）关于回车转换与libpng

如果使用Windows平台，设置空格转换:

```bash
git config --global core.autocrlf input
git config --global core.safecrlf true
```

如果Mac下报错libpng16.16.dylib with anything php related，请执行

```bash
brew install libpng
```

####（2）请保证项目目录结构为

```
workspace/project
```


####（3）常用脚本

克隆项目：

github为例子：**（公司内部请使用gerrit）**

```bash
git clone https://github.com/Roxyhuang/ant-mobile-minimize
```
安装依赖：

```bash
npm install
```
启动dev环境：

```bash
npm run dev
```

打包release环境：

```bash
npm run build
```
打包stage环境：

```bash
npm run stage
```

打包prod环境：

```bash
npm run prod
```

启动mock服务

```
npm run mock
```

### 2.目录说明

```markdown
----|---antd-mobile-template／ # 项目根目录
    |
    |---build/ ---|script/ --|---build.js # 生产环境或测试欢迎启动配置
    |             |          |---check-version.js # 检测npm版本是否正确
    |             |          |---dev-server.js # 开发环境启动配置
    |             |          |---preinstall # 预装依赖脚本
    |             |config/ --|---webpack.base.conf.js # webpack-base配置
    |             |          |---webpack.dev.conf.js # webpack-dev配置
    |             |          |---webpack.prod.conf.js # webpack-prod配置
    |             |          |---postcss.config.js    # postcss配置
    |             |bin/ -----|---commands # 命令配置
    |             |
    |---config/ --|---default.json # 默认配置
    |             |---development.json # 开发配置
    |             |---production.json # 生产配置
    |             |---release.json # 测试配置
    |             |---stage.json # 测试配置
    |
    |---mock/-----|---data/------ # 模拟数据json
    |             |---server.js-- # mock服务器配置
    |
    |---dist/ #编译后生成文件目录
    |
    |---src/-- |---assets/ ---|---css/---| # 全局样式
    |          |              |          |---mod_css/ #此目录中的样式可在入口js中直接引入全局生效
    |          |           ---|---img/ # 图片资源
    |          |---backend/---|---mixin/ #  请求组合 （暂未用到）
    |          |              |---Backend.js # 请求区分渠道 （暂未用到）
    |          |              |---Client.js  # 主请求文件 （暂未用到）
    |          |---components/|---include/ # 木偶组件 其余的为智能组建或者为页面容器
    |          |              |---container/ # 页面容器组建
    |          |---views/-----|---project/      # 多入口1
    |          |              |---project2/     # 多入口2
    |          |---router/----| # 路由配置
    |          |---utils/-----|---Console.js （暂未用到）
    |          |              |---ErrorHander.js （暂未用到）
    |          |              |---Exception.js （暂未用到）
    |---public/|---index.html # 模块页面
    |          |---assets/|---js---| # 静态资源
    |                              |--- flexible.min.js # flexible适配方案
    |                              |--- rem.min.js # clientWidth适配方案
    |---.babelrc # babel配置
    |---editorconfig # 编辑器配置
    |---eslintignore # eslint忽略文件
    |---.eslintrc # eslint配置
    |---.stylelintrc.js # stylelint配置
    |---.gitignore # git忽略文件
    |---package.json
    |---README.md

```

### 3.依赖配置

#### (1)核心依赖

a. 核心库

- react
- react-dom
> 文档：http://react-china.org/

- antd(desktop)
> 文档：https://mobile.ant.design/docs/react/introduce-cn

- webpack
> 文档：https://doc.webpack-china.org/guides

- babel
> 文档：http://babeljs.io/

b. 样式

- less
> 文档：https://less.bootcss.com/

- postcss
> 文档：http://postcss.org/

### 4.移动适配、浏览器适配以及设计稿还原

- 项目中已配置postcss 写样式时直接根据750设计稿编写px即可
- 自动浏览器适配
- 支持js获取clientWidth方案
- 支持flexible方案

### 5.关于图片引入

- 单入口图片自动在下的assets/img目录
- 多入口文件自动生成至[name]/assets/img

### 6.关于样式引入

- 采用了 css in module的方式编写css
- 可以采用global的方式引入全局css
- mod_css/ 目录下的样式，可以直接在页面入口文件处引入，全局生效
- 样式中的图片直接使用相对路径即可

### 7.关于项目配置

采用了config模块，可以在项目根目录下config下编写json文件，并可以通过

```javascript
import config from 'config';
const test = config.get('test');
```

### 8.关于mock服务

可以在mock目录中的data目录中编写json，在server.js中引入通过mock.js生成数据即可

github: https://github.com/nuysoft/Mock

官网: http://mockjs.com