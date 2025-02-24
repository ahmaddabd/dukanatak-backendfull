
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class ChangeUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['merchant', 'customer', 'admin'])
  role: string;
}
