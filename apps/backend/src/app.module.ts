import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { AbstractAuthService, AuthService, MockAuthService } from './auth.service';
import { JsonOnlyMiddleware } from './jsonOnly.middleware';
import { AbstractCodeAnalyzerService } from './kernel';
import { CodeAnalyzerService } from './kernel/codeAnalyzer.service';
import { AbstractSearchLogicService, MockSearchLogicService } from './searchlogic';

import {
  FilesService,
  LoginService,
  MeService,
  RegistryService,
  SearchService,
  TagsService,
  TimelineService
} from './api/api';
import {
  FilesController,
  LoginController,
  MeController,
  RegistryController,
  SearchController,
  TagsController,
  TimelineController
} from './controllers/controllers';
import { RepositoryService } from './repository.service';

@Module({
  imports: [HttpModule],
  exports: [AbstractAuthService],
  providers: [
    RepositoryService,
    FilesService,
    LoginService,
    MeService,
    RegistryService,
    SearchService,
    TimelineService,
    { provide: AbstractCodeAnalyzerService, useClass: CodeAnalyzerService },
    { provide: AbstractAuthService, useClass: AuthService },
    { provide: AbstractSearchLogicService, useClass: MockSearchLogicService },
    TagsService
  ],
  controllers: [
    FilesController,
    LoginController,
    MeController,
    RegistryController,
    SearchController,
    TimelineController,
    TagsController
  ],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonOnlyMiddleware)
      .forRoutes('*');
  }
}

@Module({
  imports: [HttpModule],
  exports: [AbstractAuthService],
  providers: [
    RepositoryService,
    FilesService,
    LoginService,
    MeService,
    RegistryService,
    SearchService,
    TimelineService,
    { provide: AbstractCodeAnalyzerService, useClass: CodeAnalyzerService },
    { provide: AbstractAuthService, useClass: MockAuthService },
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
export class MockAppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonOnlyMiddleware)
      .forRoutes('*');
  }
}
