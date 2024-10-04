import { Body, Controller, Post, Param } from '@nestjs/common';
import { AddItemToOrderService } from './add-item-to-order.service';
import { ItemDetailCommand } from '../entity/order-item.entity';

@Controller('orders')
export class OrderController {
    constructor(private readonly addItemToOrderService: AddItemToOrderService) {}

    @Post(':id/items')
    async addItem(@Param('id') orderId: string, @Body() item: ItemDetailCommand) {
        return this.addItemToOrderService.execute(orderId, item);
    }
}
