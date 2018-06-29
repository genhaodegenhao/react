/* eslint-disable global-require */

const pkg = require('../../package.json');
const px2rem = require('postcss-pxtorem');

module.exports = () => ({

  plugins: [

    px2rem({
      rootValue: 75,
      unitPrecision: 5,
      propList: ['*', '!border*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 12
    }),

    require('autoprefixer')({
      browsers: pkg.browserslist,
      flexbox: true,
    }),
  ],
});
