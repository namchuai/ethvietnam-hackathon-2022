import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { CONFIG_OPTIONS } from '../constants';
import { ConfigService } from './config.service';
import { ssmProvider } from './ssm.provider';

@Module({})
export class ConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      global: true,
      module: ConfigModule,
      providers: [
        ssmProvider,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
