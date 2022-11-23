/* eslint-disable @typescript-eslint/ban-types */
import { BadRequestException } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { isValidTransactionHash } from '../utils/string-utils';

export const IsTransactionHashValid = (
  message = 'Invalid transaction hash'
) => {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'IsTransactionHashValid',
      target: object.constructor,
      propertyName,
      options: { message },
      validator: {
        validate(value: string | undefined) {
          if (!value) {
            throw new BadRequestException('Transaction hash cannot be empty');
          }
          return isValidTransactionHash(value);
        },
      },
    });
  };
};
