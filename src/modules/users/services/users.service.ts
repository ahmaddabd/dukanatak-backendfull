import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  User,
  UserRole,
  UserStatus,
} from "../../../core/domain/entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CacheService } from "../../../infrastructure/caching/cache.service";
import { LoggerService } from "../../../infrastructure/logging/logger.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("البريد الإلكتروني مستخدم بالفعل");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole[createUserDto.role] || UserRole.CUSTOMER,
      status: UserStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.logBusinessEvent("user.created", { userId: savedUser.id });

    // حذف الذاكرة المؤقتة للمستخدمين
    await this.cacheService.delPattern("users:*");

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.cacheService.getOrSet("users:all", () =>
      this.userRepository.find()
    );
  }

  async findOne(id: string): Promise<User> {
    const cacheKey = `users:${id}`;
    return this.cacheService.getOrSet(cacheKey, async () => {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException("المستخدم غير موجود");
      }
      return user;
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    this.logger.logBusinessEvent("user.updated", { userId: id });

    // حذف الذاكرة المؤقتة للمستخدم
    await this.cacheService.del(`users:${id}`);
    await this.cacheService.delPattern("users:*");

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    this.logger.logBusinessEvent("user.deleted", { userId: id });

    // حذف الذاكرة المؤقتة للمستخدم
    await this.cacheService.del(`users:${id}`);
    await this.cacheService.delPattern("users:*");
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async verifyEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.emailVerified = true;

    const updatedUser = await this.userRepository.save(user);
    this.logger.logBusinessEvent("user.email.verified", { userId: id });

    await this.cacheService.del(`users:${id}`);
    return updatedUser;
  }

  async verifyPhone(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.phoneVerified = true;

    const updatedUser = await this.userRepository.save(user);
    this.logger.logBusinessEvent("user.phone.verified", { userId: id });

    await this.cacheService.del(`users:${id}`);
    return updatedUser;
  }

  async updateSettings(
    id: string,
    settings: Partial<User["settings"]>
  ): Promise<User> {
    const user = await this.findOne(id);
    user.settings = { ...user.settings, ...settings };

    const updatedUser = await this.userRepository.save(user);
    this.logger.logBusinessEvent("user.settings.updated", { userId: id });

    await this.cacheService.del(`users:${id}`);
    return updatedUser;
  }
}
