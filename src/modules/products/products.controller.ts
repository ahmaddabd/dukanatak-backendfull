import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductStatus } from "../../domain/entities/product.entity";

@ApiTags("المنتجات")
@Controller("products")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "إنشاء منتج جديد" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "تم إنشاء المنتج بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "بيانات غير صالحة",
  })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: "الحصول على قائمة المنتجات" })
  @ApiQuery({ name: "storeId", required: true })
  @ApiQuery({ name: "status", required: false, enum: ProductStatus })
  @ApiQuery({ name: "categoryId", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم استرجاع المنتجات بنجاح",
  })
  async findAll(
    @Query("storeId") storeId: string,
    @Query("status") status?: ProductStatus,
    @Query("categoryId") categoryId?: string,
    @Query("search") search?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.productsService.findAll(storeId, {
      status,
      categoryId,
      search,
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "الحصول على منتج محدد" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم استرجاع المنتج بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "المنتج غير موجود",
  })
  async findOne(@Param("id") id: string, @Query("storeId") storeId: string) {
    return this.productsService.findOne(id, storeId);
  }

  @Put(":id")
  @ApiOperation({ summary: "تحديث منتج" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم تحديث المنتج بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "المنتج غير موجود",
  })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @Request() req
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "حذف منتج" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم حذف المنتج بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "المنتج غير موجود",
  })
  async remove(@Param("id") id: string, @Request() req) {
    return this.productsService.remove(id, req.user);
  }

  @Put(":id/stock")
  @ApiOperation({ summary: "تحديث مخزون المنتج" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم تحديث المخزون بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "المنتج غير موجود",
  })
  async updateStock(
    @Param("id") id: string,
    @Body("quantity") quantity: number,
    @Request() req
  ) {
    return this.productsService.updateStock(id, quantity, req.user);
  }
}
