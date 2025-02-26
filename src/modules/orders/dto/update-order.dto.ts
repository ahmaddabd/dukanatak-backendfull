
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;
}
