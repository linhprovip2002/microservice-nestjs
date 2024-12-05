import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: createUserDto) {
    return this.userRepository.create(createUserDto);
  }
}
