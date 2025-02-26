import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Product, ProductStatus } from "../../domain/entities/product.entity";
import { Store } from "../../domain/entities/store.entity";
import { Category } from "../../domain/entities/category.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { User, UserRole } from "../../domain/entities/user.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: User
  ): Promise<Product> {
    // التحقق من المتجر
    const store = await this.storeRepository.findOne({
      where: { id: createProductDto.storeId },
      relations: ["owner"],
    });

    if (!store) {
      throw new NotFoundException("المتجر غير موجود");
    }

    // التحقق من الصلاحيات
    if (
      currentUser.role !== UserRole.ADMIN &&
      store.owner.id !== currentUser.id
    ) {
      throw new ForbiddenException("ليس لديك صلاحية لإضافة منتجات لهذا المتجر");
    }

    // التحقق من الفئات
    let categories: Category[] = [];
    if (createProductDto.categoryIds?.length) {
      categories = await this.categoryRepository.findBy({
        id: In(createProductDto.categoryIds),
        store: { id: store.id },
      });

      if (categories.length !== createProductDto.categoryIds.length) {
        throw new BadRequestException(
          "بعض الفئات غير موجودة أو لا تنتمي لهذا المتجر"
        );
      }
    }

    // التحقق من تفرد الـ SKU
    const existingSku = await this.productRepository.findOne({
      where: { sku: createProductDto.sku, store: { id: store.id } },
    });

    if (existingSku) {
      throw new BadRequestException(
        "الرقم التسلسلي مستخدم بالفعل في هذا المتجر"
      );
    }

    // إنشاء المنتج
    const product = this.productRepository.create({
      ...createProductDto,
      store,
      categories,
      status: ProductStatus.DRAFT,
    });

    return this.productRepository.save(product);
  }

  async findAll(
    storeId: string,
    options: {
      status?: ProductStatus;
      categoryId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    items: Product[];
    total: number;
    page: number;
    pageCount: number;
  }> {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.categories", "category")
      .where("product.store.id = :storeId", { storeId });

    if (options.status) {
      query.andWhere("product.status = :status", { status: options.status });
    }

    if (options.categoryId) {
      query.andWhere("category.id = :categoryId", {
        categoryId: options.categoryId,
      });
    }

    if (options.search) {
      query.andWhere(
        "(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search)",
        { search: `%${options.search}%` }
      );
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, storeId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, store: { id: storeId } },
      relations: ["categories", "store"],
    });

    if (!product) {
      throw new NotFoundException("المنتج غير موجود");
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: Partial<CreateProductDto>,
    currentUser: User
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["store", "store.owner"],
    });

    if (!product) {
      throw new NotFoundException("المنتج غير موجود");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      product.store.owner.id !== currentUser.id
    ) {
      throw new ForbiddenException("ليس لديك صلاحية لتعديل هذا المنتج");
    }

    // التحقق من الفئات الجديدة إذا تم تحديثها
    if (updateProductDto.categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(updateProductDto.categoryIds),
        store: { id: product.store.id },
      });

      if (categories.length !== updateProductDto.categoryIds.length) {
        throw new BadRequestException(
          "بعض الفئات غير موجودة أو لا تنتمي لهذا المتجر"
        );
      }

      product.categories = categories;
    }

    // تحديث المنتج
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["store", "store.owner"],
    });

    if (!product) {
      throw new NotFoundException("المنتج غير موجود");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      product.store.owner.id !== currentUser.id
    ) {
      throw new ForbiddenException("ليس لديك صلاحية لحذف هذا المنتج");
    }

    await this.productRepository.remove(product);
  }

  async updateStock(
    id: string,
    quantity: number,
    currentUser: User
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["store", "store.owner"],
    });

    if (!product) {
      throw new NotFoundException("المنتج غير موجود");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      product.store.owner.id !== currentUser.id
    ) {
      throw new ForbiddenException("ليس لديك صلاحية لتحديث مخزون هذا المنتج");
    }

    if (!product.trackQuantity) {
      throw new BadRequestException("هذا المنتج لا يتتبع المخزون");
    }

    product.quantity = quantity;
    if (quantity <= 0 && !product.allowOutOfStock) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }

    return this.productRepository.save(product);
  }
}
