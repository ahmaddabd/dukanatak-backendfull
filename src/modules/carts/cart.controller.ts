
import { Controller, Post, Delete, Patch, Get, Body, Req, UseGuards, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 200, description: 'Product added to cart successfully.' })
  addToCart(@Body() dto: AddToCartDto, @Req() req) {
    return this.cartService.addToCart(req.user.id, dto.productId, dto.storeId, dto.quantity);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart successfully.' })
  removeFromCart(@Param('productId') productId: string, @Req() req) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update product quantity in cart' })
  @ApiResponse({ status: 200, description: 'Product quantity updated successfully.' })
  updateCartItemQuantity(@Param('productId') productId: string, @Body('quantity') quantity: number, @Req() req) {
    return this.cartService.updateCartItemQuantity(req.user.id, productId, quantity);
  }

  @Get()
  @ApiOperation({ summary: 'Get cart details' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }
}
