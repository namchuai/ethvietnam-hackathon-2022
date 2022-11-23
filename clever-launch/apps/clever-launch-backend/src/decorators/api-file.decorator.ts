import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MAX_AVATAR_SIZE_IN_BYTE } from '../constants';
import { fileMimetypeFilter } from './file-mimetype-filter';

export function ApiFile(
  fieldName = 'file',
  required = false,
  localOptions?: MulterOptions
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
}

export function ApiImageFile(fileName = 'image', required = false) {
  return ApiFile(fileName, required, {
    limits: { fileSize: MAX_AVATAR_SIZE_IN_BYTE },
    fileFilter: fileMimetypeFilter('image'),
  });
}
