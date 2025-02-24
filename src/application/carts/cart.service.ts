import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { Product } from '../../domain/entities/product.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
  ) {}

  async addToCart(customerId: string, productId: string, storeId: string, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findOne({ where: { id: productId, storeId } });
    if (!product) {
      throw new NotFoundException('Product not found or does not belong to this store.');
    }

    if (product.quantityAvailable < quantity) {
      throw new BadRequestException('Insufficient product quantity available.');
    }

    let cart = await this.cartRepository.findOne({ 
      where: { customerId, storeId }, 
      relations: ['items', 'items.product'] 
    });

    if (!cart) {
      cart = this.cartRepository.create({ customerId, storeId, items: [] });
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } }
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity
      });
      cart.items.push(cartItem);
    }

    return this.cartRepository.save(cart);
  }

  async removeFromCart(customerId: string, productId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ 
      where: { customerId }, 
      relations: ['items'] 
    });
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.product.id === productId);
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async updateCartItemQuantity(customerId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ 
      where: { customerId }, 
      relations: ['items', 'items.product'] 
    });
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.product.id === productId);
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cart);
  }

  async getCart(customerId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ 
      where: { customerId }, 
      relations: ['items', 'items.product'] 
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }
}
