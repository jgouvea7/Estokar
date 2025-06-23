import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordReset, PasswordResetSchema } from './entity';
import { PasswordResetRepository } from './password-reset.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
            name: PasswordReset.name,
            schema: PasswordResetSchema
        }
    ]),
    HttpModule,
  ],
  providers: [PasswordResetRepository],
  controllers: [],
  exports: [PasswordResetRepository],
})
export class PasswordResetModule {}
