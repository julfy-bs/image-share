import { IsEmail, IsString, Length } from 'class-validator';

export class SignInUserDto {
	@IsEmail()
	email: string;
	
	@IsString()
	@Length(2)
	password: string;
}
