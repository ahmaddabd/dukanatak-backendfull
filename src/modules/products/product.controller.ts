
import { Controller, Post, Get, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('merchant')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  getProductById(@Param('id') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get products by store ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  getProductsByStore(@Param('storeId') storeId: string) {
    return this.productService.getProductsByStore(storeId);
  }

  @Delete(':id')
  @Roles('merchant')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
