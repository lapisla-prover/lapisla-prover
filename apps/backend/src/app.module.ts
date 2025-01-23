import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AbstractCodeAnalyzerService } from './kernel';
import { MockAnalyzerService } from './kernel/mockAnalyzer.service';
import { AbstractAuthService, MockAuthService } from './auth.service';

import {
  FilesService,
  LoginService,
  MeService,
  RegistryService,
  SearchService
} from './api/api';
import { PrismaService } from './prisma.service';
import {
  FilesController,
  LoginController,
  MeController,
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
    RegistryService,
    SearchService,
    { provide: AbstractCodeAnalyzerService, useClass: MockAnalyzerService },
    { provide: AbstractAuthService, useClass: MockAuthService }
  ],
  controllers: [
    FilesController,
    LoginController,
    MeController,
    RegistryController,
    SearchController
  ],

})
export class AppModule {}
