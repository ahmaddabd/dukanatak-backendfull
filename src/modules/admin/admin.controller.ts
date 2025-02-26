import { Controller, Get, Patch, Param, UseGuards, Body, Req, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users.' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('stores')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all stores.' })
  getAllStores() {
    return this.adminService.getAllStores();
  }

  @Get('stores/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved store.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  getStoreById(@Param('id') storeId: string) {
    return this.adminService.getStoreById(storeId);
  }

  @Get('customers')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all customers.' })
  getCustomers() {
    return this.adminService.getCustomers();
  }

  @Get('customers/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  getCustomerById(@Param('id') customerId: string) {
    return this.adminService.getCustomerById(customerId);
  }

  @Patch('users/:id/block')
  @Roles('admin')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 200, description: 'User blocked successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot block yourself.' })
  blockUser(@Param('id') userId: string, @Req() req) {
    const adminId = req.user.userId;
    if (adminId === userId) {
      throw new BadRequestException('Cannot block yourself.');
    }
    return this.adminService.blockUser(adminId, userId);
  }

  @Patch('users/:id/unblock')
  @Roles('admin')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully.' })
  unblockUser(@Param('id') userId: string) {
    return this.adminService.unblockUser(userId);
  }

  @Patch('users/:id/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({ status: 200, description: 'User role changed successfully.' })
  changeUserRole(@Param('id') userId: string, @Body() dto: ChangeUserRoleDto) {
    return this.adminService.changeUserRole(userId, dto.role);
  }
}
