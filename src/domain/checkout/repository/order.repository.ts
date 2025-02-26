import OrderRepositoryInterface from "./order-repository.interface";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id,
            customerId: order.customerId,
            total: order.total(),
            items: order.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                productId: item.productId
            }))
        });
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
        const orderModel = await OrderModel.findOne({ where: { id }, include: "items" });
        if (!orderModel) {
            throw new Error("Order not found");
        }

        const orderItems = orderModel.orderItems.map(item => new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        ));

        return new Order(orderModel.id, orderModel.customer_id, orderItems);
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({ include: "items" });

        return ordersModel.map(orderModel => {
            const orderItems = orderModel.orderItems.map(item => new OrderItem(
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
