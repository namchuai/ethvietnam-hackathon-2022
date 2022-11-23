import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { twMerge } from 'tailwind-merge';
import findMatch from '../../utils/findMatch';
import objectsToString from '../../utils/objectsToString';

import { useTheme } from '../../context/theme';

import type { variant, size, className } from '../../types/components/avatar';
import {
  propTypesVariant,
  propTypesSize,
  propTypesClassName,
} from '../../types/components/avatar';

export interface AvatarProps extends React.ComponentProps<'img'> {
  variant?: variant;
  size?: size;
  className?: className;
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ variant, size, className, ...rest }, ref) => {
    const { avatar } = useTheme();
    const { valid, defaultProps, styles } = avatar;
    const { base, variants, sizes } = styles;

    variant = variant ?? defaultProps.variant;
    size = size ?? defaultProps.size;
    className = className ?? defaultProps.className;

    const avatarVariant = objectsToString(
      variants[findMatch(valid.variants, variant, 'rounded')]
    );
    const avatarSize = objectsToString(
      sizes[findMatch(valid.sizes, size, 'md')]
    );
    const classes = twMerge(
      classnames(objectsToString(base), avatarVariant, avatarSize),
      className
    );

    return <img {...rest} ref={ref} className={classes} />;
  }
);

Avatar.propTypes = {
  variant: PropTypes.oneOf(propTypesVariant),
  size: PropTypes.oneOf(propTypesSize),
  className: propTypesClassName,
};

Avatar.displayName = 'Avatar';

export default Avatar;
