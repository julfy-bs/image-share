import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { saltOrRounds } from 'src/constants/constants';
import { DeleteResult, Repository } from 'typeorm';
import { appErrors } from '../constants/app-errors';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export type UpdatedUserData = Partial<User>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const isUserExist: User[] = await this.userRepository.findBy([
      { email: createUserDto.email },
    ]);
    
    if (isUserExist.length > 0) {
      throw new BadRequestException(appErrors.USER_DUPLICATE);
    }
    
    const hashPassword: string = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    
    const userDto: Partial<CreateUserDto> = {
      ...createUserDto,
      password: hashPassword,
      refreshToken: null,
    };

    return await this.userRepository.save(userDto);
  }
  
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  
  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ _id: id });
  }
  
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.hasOwnProperty('password')) {
      const hashed: string = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
      await this.userRepository.update(id, { ...updateUserDto, password: hashed });
      return this.userRepository.findOne({ where: { _id: id } });
    } else {
      await this.userRepository.update(id, updateUserDto);
      return this.userRepository.findOne({ where: { _id: id } });
    }
  }
  
  async remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .addSelect(['user.email', 'user.password'])
      .getOne();
  }
}
