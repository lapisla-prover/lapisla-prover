import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import {
  FilesService,
  LoginService,
  MeService,
  PermalinksService,
  RegistryService,
  SearchService
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
    FilesService,
    LoginService,
    MeService,
    PermalinksService,
    RegistryService,
    SearchService
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
export class AppModule {}
