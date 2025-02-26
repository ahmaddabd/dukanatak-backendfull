import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole, UserStatus } from "../../domain/entities/user.entity";
import { Store, StoreStatus } from "../../domain/entities/store.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("البريد الإلكتروني مستخدم بالفعل");
    }

    if (!this.isStrongPassword(registerDto.password)) {
      throw new BadRequestException(
        "كلمة المرور ضعيفة - يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز"
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role || UserRole.CUSTOMER,
      status: UserStatus.PENDING,
    });

    if (registerDto.role === UserRole.MERCHANT) {
      if (!registerDto.storeName || !registerDto.storeSlug) {
        throw new BadRequestException(
          "يجب تحديد اسم المتجر والرابط المختصر للتجار"
        );
      }

      const existingStore = await this.storeRepository.findOne({
        where: { slug: registerDto.storeSlug },
      });

      if (existingStore) {
        throw new BadRequestException("الرابط المختصر مستخدم بالفعل");
      }

      const store = this.storeRepository.create({
        name: registerDto.storeName,
        slug: registerDto.storeSlug,
        status: StoreStatus.PENDING,
        owner: user,
      });

      await this.userRepository.save(user);
      await this.storeRepository.save(store);
    } else {
      await this.userRepository.save(user);
    }

    return { message: "تم التسجيل بنجاح" };
  }

  private isStrongPassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["store"],
    });

    if (!user) {
      throw new UnauthorizedException(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException("تم حظر حسابك. يرجى التواصل مع الإدارة");
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      store: user.store?.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: "7d" }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.status === UserStatus.BLOCKED) {
        throw new UnauthorizedException("رمز التحديث غير صالح");
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        store: payload.store,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException("رمز التحديث غير صالح");
    }
  }
}
