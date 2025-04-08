import {
	Body,
	Controller,
	Post,
	UseGuards, Get, Req,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { RefreshTokenGuard } from './guards/jwt-refresh-token.guard';

interface RequestWithUser extends Request { user: User; }

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) {}
	
	@Post('signup')
	async signUp(@Body() createUserDto: CreateUserDto) {
		await this.authService.signUp(createUserDto);
		return this.authService.signIn({ email: createUserDto.email, password: createUserDto.password })
	}
	
	@Post('signin')
	signIn(@Body() data: SignInUserDto) {
		return this.authService.signIn(data);
	}
	
	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	refreshTokens(@Req() req: RequestWithUser) {
		const userId = req.user['sub'];
		const refreshToken = req.user['refreshToken'];
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
