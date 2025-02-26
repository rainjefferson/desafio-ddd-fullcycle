import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "../handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../handler/envia-console-log2.handler";

describe("Customer Created Event Tests", () => {
  it("should log messages when a new customer is created", () => {
    const consoleSpy = jest.spyOn(console, "log");

    const event = new CustomerCreatedEvent({ id: "123", name: "John Doe" });
    new EnviaConsoleLog1Handler().handle(event);
    new EnviaConsoleLog2Handler().handle(event);

    expect(consoleSpy).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
    expect(consoleSpy).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");

    consoleSpy.mockRestore();
  });
});
