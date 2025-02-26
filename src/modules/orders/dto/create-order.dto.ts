import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsObject()
  @IsOptional()
  variant?: {
    id: string;
    name: string;
    options: { [key: string]: string };
  };
}

export class AddressDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  tax: number;

  @IsNumber()
  shippingCost: number;

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @IsObject()
  @IsOptional()
  metadata?: {
    notes?: string;
    giftMessage?: string;
    source?: string;
    trackingNumber?: string;
  };
}
