 ---
## ant-mobile-minimize doc
---

> Author：Neo_Huang

> company git: http://gerrit.99bill.net/#/admin/projects/mkt/react-frame7-template

> github: https://github.com/Roxyhuang/ant-deskop-minimize



### How to start

#### about lf and libpng

If you want use in Windows, Please set

```bash
git config --global core.autocrlf input
git config --global core.safecrlf true
```

If show error of libpng16.16.dylib with anything php related,Please install libpng

```bash
brew install libpng
```

#### Please use directory structure

```
workspace/project
```

#### script

clone：

```bash
e.q github for company please use gerrit

git clone https://github.com/Roxyhuang/ant-mobile-minimize
```
install dependency：

```bash
npm install
```
run dev：

```bash
npm run dev
```

Beacause webpack-dashborad must run in Windows10，If you need run in Windows7, Please：

```bash
npm run dev:win
```

run release：

```bash
npm run build
```

run prod：

```bash
npm run prod
```

run stage：

```bash
npm run stage
```


### directory description

```markdown
----|---antd-mobile-template／ # root
    |
    |---build/ ---|script/ --|---build.js # entry for build
    |             |          |---check-version.js # check version of npm
    |             |          |---dev-server.js # entry for dev-server
    |             |          |---preinstall # preinstall script
    |             |config/ --|---webpack.base.conf.js # webpack-base config
    |             |          |---webpack.dev.conf.js # webpack-dev config
    |             |          |---webpack.prod.conf.js # webpack-pro config
    |             |          |---postcss.config.js    #postcss config
    |             |bin/ -----|---commands commands config
    |             |
    |---config/ --|---defalut.json # defalut config file
    |             |---development.json # dev config file
    |             |---production.json # prod config file
    |             |---release.json # release config file
    |             |---stage.json # stage config file
    |
    |---dist/ #  dist file
    |
    |---src/-- |---assets/ ---|---css/ # global style
    |          |              |          |---mod_css/ # You can use less in entry.js file
    |          |           ---|---img/ # image
    |          |---backend/---|mixin/ #  request function
    |          |              |---Backend.js # muti client file
    |          |              |---Client.js  # client file
    |          |---components/|---include/ # normal components
    |          |              |---container/ # views container
    |          |---views/-----|---project/      # entry 1
    |          |              |---project2/     # entry 2
    |          |---router/----| # router config
    |          |---utils/-----|---Console.js
    |          |              |---ErrorHander.js
    |          |              |---Exception.js
    |---mock/-----|---data/--|--- # json for mock
    |             |---server.js-- # mock server config
    |---public/|---index.html # template html
    |          |---assets/|---js---| # 静态资源
    |                              |--- flexible.min.js # flexible-mobile-layout
    |                              |--- rem.min.js # clientWidth-mobile-layout
    |
    |---.babelrc # babel config file
    |---editorconfig # editor config file
    |---eslintignore # eslint ignore file
    |---.eslintrc # eslint config file
    |---.stylelintrc.js # stylelint config file
    |---.gitignore # git ignore file
    |---package.json
    |---README.md English README.MD
    |---README.ZH.md Chinese README.MD

```

### dependency config

#### 1.core

（1）core dependency

- react
- react-dom
> doc：http://react-china.org/

- antd(desktop)
> doc：https://mobile.ant.design/docs/react/introduce-cn

- webpack
> doc：https://doc.webpack-china.org/guides

- babel
> doc：http://babeljs.io/

（2）style

- less
> doc：https://less.bootcss.com/

- postcss
> doc：http://postcss.org/

### About mobile and layout

- Please use px unit for base 750px design
- autoprefixer
- support mobile layout base clientWidth
- support mobile layout base flexible

### About Style

- support css in module
- support global css
- mod_css/ You can use less in entry.js file

### About config file

If you need write config file and get config , You can use node-config module

```javascript
import config from 'config';
const test = config.get('test');
```
### About mock service

You can use in mock/ by jason

github: https://github.com/nuysoft/Mock

doc: http://mockjs.com
