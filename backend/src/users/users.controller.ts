import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import {
  AccessTokenGuard,
} from 'src/auth/guards/jwt-access-token.guard';
import { UserInterceptor } from '../interceptors/user-intercept';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export interface RequestWithUser extends IRequest {
  user: User;
}

@UseInterceptors(UserInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  /* @Get('me')
  getCurrentUser(@Request() req: RequestWithUser): User {
    return req.user;
  }

  @Patch('me')
  patchCurrentUser(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdatedUserData> {
    return this.usersService.updateUser(req.user, updateUserDto);
  } */

/*
  @Get('me/wishes')
  async findMeWishes(@Request() req: RequestWithUser): Promise<Wish[]> {
    const { id } = req.user;
    return this.wishesService.findUsersWishes(id);
  }
*/

  /* @Get(':email')
  async getUser(@Param('email') email: string): Promise<User> {
    return await this.usersService.getUser(email);
  } */

  /* @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user: User = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException(appErrors.USER_NOT_FOUND);
    }

    return this.wishesService.findUsersWishes(user.id);
  } */

/*   @Post('find')
  async findUser(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findUserByQuery(query);
  } */
}
