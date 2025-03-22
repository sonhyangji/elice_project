import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserById(id:string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not Found')
    return user;
  }

  async getUserByEmail(email:string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if(!user) throw new NotFoundException('User not Found')
    return user;
  }

}
