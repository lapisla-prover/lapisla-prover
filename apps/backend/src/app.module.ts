import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AbstractCodeAnalyzerService } from './kernel';
import { MockAnalyzerService } from './kernel/mockAnalyzer.service';
import { AbstractAuthService, AuthService } from './auth.service';
import { JsonOnlyMiddleware } from './jsonOnly.middleware';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { AbstractSearchLogicService, MockSearchLogicService } from './searchlogic';

import {
  FilesService,
  LoginService,
  MeService,
  RegistryService,
  SearchService,
  TimelineService
} from './api/api';
import { PrismaService } from './prisma.service';
import {
  FilesController,
  LoginController,
  MeController,
  RegistryController,
  SearchController,
  TimelineController
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
    TimelineService,
    { provide: AbstractCodeAnalyzerService, useClass: MockAnalyzerService },
    { provide: AbstractAuthService, useClass: AuthService },
    { provide: AbstractSearchLogicService, useClass: MockSearchLogicService }
  ],
  controllers: [
    FilesController,
    LoginController,
    MeController,
    RegistryController,
    SearchController,
    TimelineController
  ],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonOnlyMiddleware)
      .forRoutes('*');
  }
}
