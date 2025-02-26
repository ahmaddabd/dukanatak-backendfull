import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Shipping,
  ShippingStatus,
} from "../../domain/entities/shipping.entity";
import { BaseRepository } from "./base.repository";

export interface IShippingRepository {
  findByTrackingNumber(trackingNumber: string): Promise<Shipping>;
  findByStatus(status: ShippingStatus): Promise<Shipping[]>;
  findByStoreId(storeId: string): Promise<Shipping[]>;
  updateStatus(id: string, status: ShippingStatus): Promise<Shipping>;
}

@Injectable()
export class ShippingRepository
  extends BaseRepository<Shipping>
  implements IShippingRepository
{
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>
  ) {
    super(shippingRepository);
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Shipping> {
    return this.findOne({
      trackingDetails: { trackingNumber },
    });
  }

  async findByStatus(status: ShippingStatus): Promise<Shipping[]> {
    return this.findAll({
      where: { status },
      relations: ["order", "store"],
    });
  }

  async findByStoreId(storeId: string): Promise<Shipping[]> {
    return this.findAll({
      where: { store: { id: storeId } },
      relations: ["order", "store"],
    });
  }

  async updateStatus(id: string, status: ShippingStatus): Promise<Shipping> {
    const shipping = await this.findById(id);
    shipping.status = status;
    shipping.trackingDetails.trackingHistory.push({
      status,
      timestamp: new Date(),
    });
    return this.update(id, shipping);
  }
}
