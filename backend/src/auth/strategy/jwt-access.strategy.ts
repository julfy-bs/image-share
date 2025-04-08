import * as process from 'node:process';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { appErrors } from '../../constants/app-errors';
import { UsersService } from 'src/users/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}
	
	async validate(jwtPayload: any): Promise<User> {
		const user: User = await this.userService.findById(jwtPayload.sub);
		
		if (!user) {
			throw new NotFoundException(appErrors.USER_NOT_FOUND);
		}
		
		return user;
	}
}
