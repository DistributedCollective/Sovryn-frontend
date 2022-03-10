const postcssNormalize = require('postcss-normalize');
const path = require('path');

const upgradePostCssLoaderEntry = entry => {
  if (entry && typeof entry === 'object') {
    if (entry.loader && entry.loader.includes('postcss-loader')) {
      return {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              postcssNormalize(),
            ],
          },
        },
      };
    }
  } else if (typeof entry === 'string') {
    if (entry.includes('postcss-loader')) {
      return require.resolve('postcss-loader');
    }
  }
  return entry;
};

const upgradePostCssLoader = rules =>
  rules
    .map(rule => {
      if (rule.use) {
        rule.use = Array.isArray(rule.use)
          ? rule.use.map(upgradePostCssLoaderEntry)
          : upgradePostCssLoaderEntry(rule.use);
        return rule;
      } else if (Array.isArray(rule.oneOf)) {
        rule.oneOf = upgradePostCssLoader(rule.oneOf);
      }
      return rule;
    })
    .filter(Boolean);

module.exports = async ({ config }) => {
  // Upgrades postcss-loader from react-scripts to the newest version, to enable postcss 8.
  // Also enforces the same postcss plugins as in the app.
  config.module.rules = upgradePostCssLoader(config.module.rules);

  return config;
};
