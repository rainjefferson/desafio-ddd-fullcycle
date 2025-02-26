import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";

export default class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
  }

  setAddress(address: Address): void {
    this._address = address;
  }

  get isActive(): boolean {
    return this._active;
  }

  activate(): void {
    if (!this._address) {
      throw new Error("Address is required to activate customer");
    }
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  addRewardPoints(points: number): void {
    this._rewardPoints += points;
  }

  private validate(): void {
    if (!this._id) {
      throw new Error("Id is required");
    }
    if (!this._name) {
      throw new Error("Name is required");
    }
  }
}
