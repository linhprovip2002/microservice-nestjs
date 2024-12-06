import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: createUserDto) {
    return this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }
  async validatorUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ email });
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Credentials are not valid');
      }
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }
}
