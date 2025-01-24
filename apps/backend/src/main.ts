import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser())

    app.enableCors({
        origin: ['http://localhost:3001', 'http://127.0.0.1:5500'],
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    });


    await app.listen(3000);
}
bootstrap();
