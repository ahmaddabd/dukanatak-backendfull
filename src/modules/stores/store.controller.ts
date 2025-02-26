
import { Controller, Post, Patch, Delete, Get, Body, Param, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('stores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @Roles('merchant')
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully.' })
  async create(@Body() dto: CreateStoreDto, @Req() req) {
    const isAvailable = await this.storeService.isSlugAvailable(dto.slug);
    if (!isAvailable) {
      throw new BadRequestException('Slug is already in use.');
    }
    return this.storeService.create({ ...dto, ownerId: req.user.userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store details' })
  @ApiResponse({ status: 200, description: 'Store details retrieved successfully.' })
  getStore(@Param('id') id: string) {
    return this.storeService.getStore(id);
  }

  @Patch(':id')
  @Roles('merchant')
  @ApiOperation({ summary: 'Update store details' })
  @ApiResponse({ status: 200, description: 'Store updated successfully.' })
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto, @Req() req) {
    if (dto.slug) {
      const isAvailable = await this.storeService.isSlugAvailable(dto.slug);
      if (!isAvailable) {
        throw new BadRequestException('Slug is already in use.');
      }
    }
    return this.storeService.update(id, dto);
  }

  @Delete(':id')
  @Roles('merchant')
  @ApiOperation({ summary: 'Delete a store' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.storeService.delete(id);
  }

  @Patch(':id/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve a store' })
  @ApiResponse({ status: 200, description: 'Store approved successfully.' })
  approveStore(@Param('id') id: string) {
    return this.storeService.approveStore(id);
  }
}
