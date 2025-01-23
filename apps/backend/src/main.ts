import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:3001'],
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    });

    await app.listen(3000);
}
bootstrap();
