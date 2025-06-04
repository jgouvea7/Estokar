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
        brokers: ['localhist:9092']
      },
      consumer: {
        groupId: 'inventory-main'
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
