import { NestFactory } from '@nestjs/core';
import { AppModule, MockAppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
    let app: INestApplication;
    if (process.env.DEV === 'true') {
        console.log('[Lapisla backend] Running in DEV mode');
        app = await NestFactory.create(MockAppModule);
    } else {
        app = await NestFactory.create(AppModule);
    }
    app.use(cookieParser())
    app.enableCors({
        origin: ['http://localhost:3001'],
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    });
    await app.listen(3000);
}
bootstrap();
