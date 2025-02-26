import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import Order from "../entity/order";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";
import OrderItem from "../entity/order_item";

describe("OrderRepository Unit Tests", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([OrderModel]);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create an order", async () => {
        const orderRepository = new OrderRepository();
        const orderItem = new OrderItem("i1", "Item 1", 100, "p1", 1);
        const order = new Order("o1", "c1", [orderItem]);

        await orderRepository.create(order);
        const orderModel = await OrderModel.findOne({ where: { id: "o1" } });

        expect(orderModel).toBeDefined();
        expect(orderModel.id).toBe(order.id);
        expect(orderModel.total).toBe(order.total());
    });

    it("should update an order", async () => {
        const orderRepository = new OrderRepository();
        const orderItem = new OrderItem("i1", "Item 1", 100, "p1", 1);
        const order = new Order("o1", "c1", [orderItem]);

        await orderRepository.create(order);

        orderItem.changeQuantity(2);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ where: { id: "o1" } });

        expect(orderModel.total).toBe(order.total());
    });

    it("should find an order by id", async () => {
        const orderRepository = new OrderRepository();
        const orderItem = new OrderItem("i1", "Item 1", 100, "p1", 1);
        const order = new Order("o1", "c1", [orderItem]);

        await orderRepository.create(order);
        const foundOrder = await orderRepository.find("o1");

        expect(foundOrder).toBeDefined();
        expect(foundOrder.id).toBe("o1");
        expect(foundOrder.customerId).toBe("c1");
        expect(foundOrder.total()).toBe(100);
    });

    it("should find all orders", async () => {
        const orderRepository = new OrderRepository();

        const orderItem1 = new OrderItem("i1", "Item 1", 100, "p1", 1);
        const orderItem2 = new OrderItem("i2", "Item 2", 200, "p2", 1);

        const order1 = new Order("o1", "c1", [orderItem1]);
        const order2 = new Order("o2", "c2", [orderItem2]);

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders.length).toBe(2);
    });
});
