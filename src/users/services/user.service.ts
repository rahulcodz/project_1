import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { hashPassword } from '../../common/utils/hash-password.util';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CredibilityService } from './credibility.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly credibilityService: CredibilityService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ deleted: false })
      .select('email userName name userType')
      .exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async getCurrentUser(req: Request) {
    try {
      const currentUser = await this.userModel
        .findById(String((req as any).user.userId))
        .select('email userName name userType')
        .exec();

      return currentUser;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateUser(req: Request, updateUserDto: UpdateUserDto) {
    try {
      const localUser = await this.findById(String(updateUserDto.id));
      if (localUser.id !== String((req as any).user.userId))
        throw new BadRequestException(
          'You do not authorized to perform this action',
        );

      if (updateUserDto.tags) localUser.tags = updateUserDto.tags;
      if (updateUserDto.name) localUser.name = updateUserDto.name;
      if (updateUserDto.userName) localUser.userName = updateUserDto.userName;

      await localUser.save();

      return 'Details updated';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async refreshCredibility() {
    try {
      return this.credibilityService.refreshCredibility();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
