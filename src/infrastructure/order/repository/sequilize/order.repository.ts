import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(order: Order): Promise<void> {
        const createdOrder = await OrderModel.create({
            id: order.id,
            customer_id: order.customerId,
            total: order.total()
        });

        await Promise.all(order.items.map(item =>
            OrderItemModel.create({
                id: item.id,
                order_id: order.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                product_id: item.productId
            })
        ));
    }

    async update(order: Order): Promise<void> {
        await OrderModel.update(
            {
                total: order.total(),
            },
            { where: { id: order.id } }
        );
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ where: { id }, include: [{ model: OrderItemModel, as: 'orderItems' }] });
        if (!orderModel) {
            throw new Error("Order not found");
        }

        const orderItems = (orderModel.orderItems as OrderItemModel[]).map(item => new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        ));

        return new Order(orderModel.id, orderModel.customer_id, orderItems);
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({ include: [{ model: OrderItemModel, as: 'orderItems' }] });

        return ordersModel.map(orderModel => {
            const orderItems = (orderModel.orderItems as OrderItemModel[]).map(item => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ));

            return new Order(orderModel.id, orderModel.customer_id, orderItems);
        });
    }
}