import {IBuyer, IBuyerValidationResult, TPayment} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Buyer {
    private static EMPTY_BUYER: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }
    protected buyer: IBuyer = structuredClone(Buyer.EMPTY_BUYER);
    constructor(protected events: IEvents) {
    }

    setPayment(payment: TPayment) {
        this.buyer.payment = payment;
        this.events.emit("buyer:updated");
    }

    setAddress(address: string) {
        this.buyer.address = address.trim();
        this.events.emit("buyer:updated");
    }

    setEmail(email: string) {
        this.buyer.email = email.trim();
        this.events.emit("buyer:updated");
    }

    setPhone(phone: string) {
        this.buyer.phone = phone.trim();
        this.events.emit("buyer:updated");
    }

    getBuyer(): IBuyer {
        return this.buyer;
    }

    clear() {
        this.buyer = structuredClone(Buyer.EMPTY_BUYER);
        this.events.emit("buyer:updated");
    }

    validate(): IBuyerValidationResult {
        const result: IBuyerValidationResult = {};
        if (this.buyer.payment === '') {
            result.payment = "Пожалуйста, укажите метод оплаты"
        }
        if (this.buyer.phone === '') {
            result.phone = "Пожалуйста, введите телефон в формате +79991234567"
        }
        if (this.buyer.address === '') {
            result.address = "Пожалуйста, укажите адрес доставки"
        }
        if (this.buyer.email === '') {
            result.email = "Пожалуйста, укажите корректный email"
        }
        return result;
    }


}