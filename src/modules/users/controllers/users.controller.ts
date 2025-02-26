import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { Roles } from "../../core/decorators/roles.decorator";
import { ROLES } from "../../core/constants/common.constants";
import { User } from "../../domain/entities/user.entity";

@ApiTags("المستخدمين")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "إنشاء مستخدم جديد" })
  @ApiResponse({
    status: 201,
    description: "تم إنشاء المستخدم بنجاح",
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "الحصول على قائمة المستخدمين" })
  @ApiResponse({
    status: 200,
    description: "تم استرجاع قائمة المستخدمين بنجاح",
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "الحصول على مستخدم محدد" })
  @ApiResponse({
    status: 200,
    description: "تم استرجاع المستخدم بنجاح",
  })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "تحديث مستخدم" })
  @ApiResponse({
    status: 200,
    description: "تم تحديث المستخدم بنجاح",
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "حذف مستخدم" })
  @ApiResponse({
    status: 200,
    description: "تم حذف المستخدم بنجاح",
  })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Post(":id/verify-email")
  @ApiOperation({ summary: "تفعيل البريد الإلكتروني" })
  @ApiResponse({
    status: 200,
    description: "تم تفعيل البريد الإلكتروني بنجاح",
  })
  verifyEmail(@Param("id") id: string) {
    return this.usersService.verifyEmail(id);
  }

  @Post(":id/verify-phone")
  @ApiOperation({ summary: "تفعيل رقم الهاتف" })
  @ApiResponse({
    status: 200,
    description: "تم تفعيل رقم الهاتف بنجاح",
  })
  verifyPhone(@Param("id") id: string) {
    return this.usersService.verifyPhone(id);
  }

  @Patch(":id/settings")
  @ApiOperation({ summary: "تحديث إعدادات المستخدم" })
  @ApiResponse({
    status: 200,
    description: "تم تحديث الإعدادات بنجاح",
  })
  updateSettings(
    @Param("id") id: string,
    @Body() settings: Partial<User["settings"]>
  ) {
    return this.usersService.updateSettings(id, settings);
  }
}
