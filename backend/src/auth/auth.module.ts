import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
	exports: [AuthService],
})
export class AuthModule {
}
