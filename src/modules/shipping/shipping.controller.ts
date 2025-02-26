import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CommandBus } from "../../infrastructure/cqrs/command.bus";
import { QueryBus } from "../../infrastructure/cqrs/query.bus";
import { CreateShippingCommand } from "./commands/create-shipping.command";
import { GetShippingDetailsQuery } from "./queries/get-shipping-details.query";
import {
  ShippingMethod,
  ShippingStatus,
  DeliveryZone,
} from "../../domain/entities/shipping.entity";

@ApiTags("الشحن والتوصيل")
@Controller("shipping")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShippingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post(":orderId")
  @ApiOperation({ summary: "إنشاء شحنة جديدة" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "تم إنشاء الشحنة بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "بيانات غير صالحة",
  })
  async createShipping(
    @Param("orderId") orderId: string,
    @Body()
    shippingData: {
      method: ShippingMethod;
      deliveryZone: DeliveryZone;
      deliveryAddress: {
        fullName: string;
        phone: string;
        alternativePhone?: string;
        address: string;
        city: string;
        region: string;
        landmark?: string;
        notes?: string;
      };
      metadata?: {
        packageWeight?: number;
        packageDimensions?: {
          length: number;
          width: number;
          height: number;
        };
        isFragile?: boolean;
        requiresRefrigeration?: boolean;
        specialHandling?: string[];
      };
    },
    @Request() req
  ) {
    const command = new CreateShippingCommand(orderId, shippingData, req.user);
    return this.commandBus.execute(command);
  }

  @Post(":shippingId/status")
  @ApiOperation({ summary: "تحديث حالة الشحنة" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم تحديث حالة الشحنة بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "بيانات غير صالحة",
  })
  async updateShippingStatus(
    @Param("shippingId") shippingId: string,
    @Body()
    updateData: {
      status: ShippingStatus;
      location?: string;
      notes?: string;
      deliveryDetails?: {
        driverId?: string;
        driverName?: string;
        driverPhone?: string;
        vehicleType?: string;
        vehicleNumber?: string;
        estimatedDeliveryTime?: Date;
        actualDeliveryTime?: Date;
      };
    },
    @Request() req
  ) {
    return this.shippingService.updateShippingStatus(
      shippingId,
      updateData.status,
      {
        location: updateData.location,
        notes: updateData.notes,
        deliveryDetails: updateData.deliveryDetails,
      },
      req.user
    );
  }

  @Get(":shippingId")
  @ApiOperation({ summary: "الحصول على تفاصيل الشحنة" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم استرجاع تفاصيل الشحنة بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "الشحنة غير موجودة",
  })
  async getShippingDetails(
    @Param("shippingId") shippingId: string,
    @Request() req
  ) {
    const query = new GetShippingDetailsQuery(shippingId, req.user);
    return this.queryBus.execute(query);
  }

  @Get("cost/estimate")
  @ApiOperation({ summary: "حساب تكلفة الشحن التقديرية" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم حساب التكلفة التقديرية بنجاح",
  })
  async calculateEstimatedCost(
    @Query("deliveryZone") deliveryZone: DeliveryZone,
    @Query("method") method: ShippingMethod,
    @Body()
    metadata?: {
      packageWeight?: number;
      packageDimensions?: {
        length: number;
        width: number;
        height: number;
      };
    }
  ) {
    return this.shippingService.calculateEstimatedCost(
      deliveryZone,
      method,
      metadata
    );
  }
}
