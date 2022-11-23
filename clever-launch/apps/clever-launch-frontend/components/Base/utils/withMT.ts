import merge from 'deepmerge';
import colors from '../theme/base/colors';
const typography = require('../theme/base/typography');
const shadows = require('../theme/base/shadows');
const breakpoints = require('../theme/base/breakpoints');

const ClientConfig = {
  darkMode: 'class',
  theme: {
    colors,
    fontFamily: typography,
    boxShadow: shadows,
    screens: breakpoints,
  },
  plugins: [],
};

function withMT(tailwindConfig) {
  const themeFont = ClientConfig.theme.fontFamily;

  if (tailwindConfig.theme.fontFamily) {
    const { sans, serif, body } = tailwindConfig.theme.fontFamily;

    themeFont.sans = sans || themeFont.sans;
    themeFont.serif = serif || themeFont.serif;
    themeFont.body = body || themeFont.body;
  }

  return merge(ClientConfig, { ...tailwindConfig });
}

module.exports = withMT;
