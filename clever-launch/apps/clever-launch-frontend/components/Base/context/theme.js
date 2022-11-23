import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import theme from '../theme/index';
import combineMerge from '../utils/combineMerge';

const Theme = createContext(theme);

Theme.displayName = 'ThemeProvider';

function ThemeProvider({ value, children }) {
  const mergedValue = merge(theme, value, { arrayMerge: combineMerge });

  return <Theme.Provider value={mergedValue}>{children}</Theme.Provider>;
}

const useTheme = () => useContext(Theme);

ThemeProvider.defaultProps = {
  value: theme,
};

ThemeProvider.propTypes = {
  value: PropTypes.instanceOf(Object),
  children: PropTypes.node.isRequired,
};

export { Theme, ThemeProvider, useTheme };
