import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        BACKEND_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        REDIS_HOST:Joi.string().required(),
        REDIS_PORT:Joi.number().required(),
        REDIS_TTL:Joi.number().required(),
        ACCESSTOKEN_SECRET:Joi.string().required(),
        ACCESSTOKEN_EXPIRATION_TIME:Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID:Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET:Joi.string().required(),
        GOOGLE_AUTH_CALLBACK_URL:Joi.string().required(),
      }),
    }),
    DatabaseModule,
    ProductModule,
    CommentModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
