import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import {
  ApiModule,
  FilesService,
  LoginService,
  MeService,
  PermalinksService,
  RegistryService,
  SearchService
} from './generated/openapi';
import {
  MyFilesService,
  MyLoginService,
  MyMeService,
  MyPermalinksService,
  MyRegistryService,
  MySearchService
} from './api/api';
import { PrismaService } from './prisma.service';
import {
  FilesController,
  LoginController,
  MeController,
  PermalinksController,
  RegistryController,
  SearchController
} from './controllers/controllers';

@Module({
  imports: [ HttpModule ],
  exports: [  ],
  providers: [
    PrismaService,
    MyFilesService,
    {
      provide: LoginService,
      useClass: MyLoginService
    },
    {
      provide: MeService,
      useClass: MyMeService
    },
    {
      provide: PermalinksService,
      useClass: MyPermalinksService
    },
    {
      provide: RegistryService,
      useClass: MyRegistryService
    },
    {
      provide: SearchService,
      useClass: MySearchService
    }
  ],
  controllers: [
    FilesController,
    LoginController,
    MeController,
    PermalinksController,
    RegistryController,
    SearchController
  ],

})
export class AppModule extends ApiModule {}
