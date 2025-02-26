import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  ValidateNested,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import {
  ProductStatus,
  ProductType,
} from "../../../domain/entities/product.entity";

class ProductOptionDto {
  @ApiProperty({ description: "اسم الخيار (مثل: المقاس، اللون)" })
  @IsString()
  name: string;

  @ApiProperty({ description: "قيم الخيار (مثل: أحمر، أزرق)" })
  @IsArray()
  @IsString({ each: true })
  values: string[];
}

class ProductVariantDto {
  @ApiProperty({ description: "الرقم التسلسلي للمنتج" })
  @IsString()
  sku: string;

  @ApiProperty({ description: "سعر النسخة" })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "الكمية المتوفرة" })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: "خيارات النسخة" })
  @ValidateNested()
  @Type(() => Object)
  options: { [key: string]: string };
}

class ProductShippingDto {
  @ApiProperty({ description: "وزن المنتج" })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: "عرض المنتج" })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: "ارتفاع المنتج" })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: "طول المنتج" })
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiProperty({ description: "شحن مجاني" })
  @IsBoolean()
  @IsOptional()
  freeShipping?: boolean;

  @ApiProperty({ description: "فئة الشحن" })
  @IsString()
  @IsOptional()
  shippingClass?: string;
}

export class CreateProductDto {
  @ApiProperty({ description: "اسم المنتج" })
  @IsString()
  name: string;

  @ApiProperty({ description: "الرقم التسلسلي للمنتج" })
  @IsString()
  sku: string;

  @ApiProperty({ description: "وصف المنتج" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "سعر المنتج" })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "سعر المقارنة" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @ApiProperty({ description: "تكلفة المنتج" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @ApiProperty({ description: "الكمية المتوفرة" })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: "تتبع الكمية" })
  @IsBoolean()
  @IsOptional()
  trackQuantity?: boolean;

  @ApiProperty({ description: "السماح بالبيع عند نفاد المخزون" })
  @IsBoolean()
  @IsOptional()
  allowOutOfStock?: boolean;

  @ApiProperty({ description: "الحد الأدنى للطلب" })
  @IsNumber()
  @IsOptional()
  @Min(1)
  minOrderQuantity?: number;

  @ApiProperty({ description: "الحد الأقصى للطلب" })
  @IsNumber()
  @IsOptional()
  @Min(1)
  maxOrderQuantity?: number;

  @ApiProperty({ description: "حالة المنتج", enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ description: "نوع المنتج", enum: ProductType })
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @ApiProperty({ description: "صور المنتج" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: "خيارات المنتج" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  @IsOptional()
  options?: ProductOptionDto[];

  @ApiProperty({ description: "نسخ المنتج" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variants?: ProductVariantDto[];

  @ApiProperty({ description: "معلومات الشحن" })
  @ValidateNested()
  @Type(() => ProductShippingDto)
  @IsOptional()
  shipping?: ProductShippingDto;

  @ApiProperty({ description: "معرف المتجر" })
  @IsUUID()
  storeId: string;

  @ApiProperty({ description: "معرفات الفئات" })
  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  categoryIds?: string[];
}
