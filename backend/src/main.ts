import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'inventory-app',
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'inventory-main'
      },
    },
  });

  await app.enableCors("localhost:3000")
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
