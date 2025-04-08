import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import base from './config/base.config';
import database from './config/database.config';
import token from './config/token.config';
import { DatabaseService } from './database/database.service';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [base, database, token],
		}),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseService,
			inject: [DatabaseService],
		}),
		UsersModule,
		AuthModule,
	],
	providers: [DatabaseService],
})
export class AppModule {
}
