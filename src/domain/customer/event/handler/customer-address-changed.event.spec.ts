import CustomerAddressChangedEvent from "../customer-address-changed.event";
import EnviaConsoleLogHandler from "../handler/envia-console-log-address.handler";

describe("Customer Address Changed Event Tests", () => {
  it("should log message when customer address is changed", () => {
    const consoleSpy = jest.spyOn(console, "log");

    const event = new CustomerAddressChangedEvent({
      id: "123",
      name: "John Doe",
      address: "Rua ABC, 123, 12345-678 S�o Paulo",
    });

    new EnviaConsoleLogHandler().handle(event);

    expect(consoleSpy).toHaveBeenCalledWith("Endere�o do cliente: 123, John Doe alterado para: Rua ABC, 123, 12345-678 S�o Paulo");

    consoleSpy.mockRestore();
  });
});
