import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import {
  PaymentMethod,
  PaymentCurrency,
} from "../../domain/entities/payment.entity";

@ApiTags("المدفوعات")
@Controller("payments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(":orderId")
  @ApiOperation({ summary: "إنشاء عملية دفع جديدة" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "تم إنشاء عملية الدفع بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "بيانات غير صالحة",
  })
  async createPayment(
    @Param("orderId") orderId: string,
    @Body()
    paymentData: {
      method: PaymentMethod;
      currency: PaymentCurrency;
      billingDetails: {
        name: string;
        email: string;
        phone: string;
        address: {
          line1: string;
          line2?: string;
          city: string;
          region: string;
          postalCode?: string;
          country: string;
        };
      };
      paymentDetails?: {
        transferNumber?: string;
        bankName?: string;
        branchName?: string;
        accountNumber?: string;
        transferDate?: Date;
        senderName?: string;
        attachmentUrl?: string;
      };
    },
    @Request() req
  ) {
    return this.paymentsService.createPayment(orderId, paymentData, req.user);
  }

  @Post(":paymentId/verify")
  @ApiOperation({ summary: "التحقق من عملية الدفع" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم التحقق من عملية الدفع بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "فشل التحقق من عملية الدفع",
  })
  async verifyPayment(
    @Param("paymentId") paymentId: string,
    @Body()
    verificationData: {
      notes?: string;
      attachments?: string[];
    },
    @Request() req
  ) {
    return this.paymentsService.verifyPayment(
      paymentId,
      verificationData,
      req.user
    );
  }

  @Post(":paymentId/refund")
  @ApiOperation({ summary: "استرجاع عملية الدفع" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم استرجاع عملية الدفع بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "فشل استرجاع عملية الدفع",
  })
  async refundPayment(
    @Param("paymentId") paymentId: string,
    @Body("reason") reason: string,
    @Request() req
  ) {
    return this.paymentsService.refundPayment(paymentId, reason, req.user);
  }

  @Get(":paymentId")
  @ApiOperation({ summary: "الحصول على تفاصيل عملية الدفع" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم استرجاع تفاصيل عملية الدفع بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "عملية الدفع غير موجودة",
  })
  async getPaymentDetails(
    @Param("paymentId") paymentId: string,
    @Request() req
  ) {
    return this.paymentsService.getPaymentDetails(paymentId, req.user);
  }
}
