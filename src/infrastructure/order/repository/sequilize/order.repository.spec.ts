import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["orderItems"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            orderItems: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 1);
        const order = new Order("o1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        orderItem.changeQuantity(2);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["orderItems"] });
        expect(orderModel.total).toBe(order.total());
    });

    it("should find an order by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 1);
        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);
        expect(foundOrder).toBeDefined();
        expect(foundOrder.id).toBe(order.id);
        expect(foundOrder.customerId).toBe(order.customerId);
        expect(foundOrder.total()).toBe(order.total());
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("c1", "Customer 1");
        const customer2 = new Customer("c2", "Customer 2");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address);
        customer2.changeAddress(address);
        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product1 = new Product("p1", "Product 1", 100);
        const product2 = new Product("p2", "Product 2", 200);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("i1", product1.name, product1.price, product1.id, 1);
        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 1);

        const order1 = new Order("o1", customer1.id, [orderItem1]);
        const order2 = new Order("o2", customer2.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();
        expect(orders.length).toBe(2);
        expect(orders[0].id).toBe(order1.id);
        expect(orders[1].id).toBe(order2.id);
    });
});