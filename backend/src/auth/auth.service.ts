import {
	BadRequestException,
	Injectable,
	NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { appErrors } from '../constants/app-errors';
import { saltOrRounds } from '../constants/constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
	}
	
	async signUp(createUserDto: CreateUserDto): Promise<User> {
		const userExists = await this.userService.findUserByEmail(
			createUserDto.email,
		);
		if (userExists) {
			throw new BadRequestException(appErrors.USER_DUPLICATE);
		}
		return await this.userService.create(createUserDto);
	}
	
	async signIn(data: SignInUserDto): Promise<AuthResponseDto> {
		const user = await this.validateUser(data);
		const tokens: AuthResponseDto = await this.getTokens(user._id, user.email);
		await this.updateRefreshToken(user._id, tokens.refreshToken);
		return tokens;
	}
	
	async hashData(data: string) {
		return bcrypt.hash(data, saltOrRounds);
	}
	
	async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.hashData(refreshToken);
		await this.userService.update(userId, {
			refreshToken: hashedRefreshToken,
		});
	}
	
	async getTokens(userId: string, email: string): Promise<AuthResponseDto> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: '15m',
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: '7d',
				},
			),
		]);
		
		return {
			accessToken,
			refreshToken,
		};
	}
	
	async refreshTokens(userId: string, refreshToken: string) {
		const user = await this.userService.findById(userId);
		if (!user || !user.refreshToken) {
			throw new ForbiddenException(appErrors.APP_ACCESS_DENIED);
		}
		
		const refreshTokenMatches = await bcrypt.compare(
			refreshToken,
			user.refreshToken,
		);
		
		if (!refreshTokenMatches) {
			throw new ForbiddenException(appErrors.APP_ACCESS_DENIED);
		}
		
		const tokens = await this.getTokens(user._id, user.email);
		await this.updateRefreshToken(user._id, tokens.refreshToken);
		return tokens;
	}
	
	async validateUser(data: SignInUserDto): Promise<User> {
		const { email, password } = data;
		const user = await this.userService.findUserByEmail(email);
		
		if (!user) {
			throw new NotFoundException(appErrors.LOGIN_FAILED);
		}
		
		const passwordMatches = await bcrypt.compare(
			password,
			user.password,
		);
		
		if (!passwordMatches) {
			throw new BadRequestException(appErrors.LOGIN_FAILED);
		}
		
		return user;
	}
}
