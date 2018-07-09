  /* eslint-disable global-require */

const pkg = require('../../package.json');
const px2rem = require('postcss-px2rem');

module.exports = () => ({

  plugins: [

    require('postcss-nested')(),

    px2rem({remUnit: 75}),

    require('autoprefixer')({
      browsers: pkg.browserslist,
      flexbox: 'no-2009',
    }),
  ],
});
