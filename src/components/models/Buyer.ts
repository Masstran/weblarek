import {IBuyer, IBuyerValidationResult, TPayment} from "../../types";

export class Buyer {
    private static EMPTY_BUYER: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }
    protected _buyer: IBuyer = structuredClone(Buyer.EMPTY_BUYER);

    setPayment(payment: TPayment) {
        this._buyer.payment = payment;
    }

    setAddress(address: string) {
        this._buyer.address = address.trim();
    }

    setEmail(email: string) {
        this._buyer.email = email.trim();
    }

    setPhone(phone: string) {
        this._buyer.phone = phone.trim();
    }

    getBuyer(): IBuyer {
        return this._buyer;
    }

    clear() {
        this._buyer = structuredClone(Buyer.EMPTY_BUYER);
    }

    validate(): IBuyerValidationResult {
        let result: IBuyerValidationResult = {};
        if (this._buyer.payment === '') {
            result.payment = "Пожалуйста, укажите метод оплаты"
        }
        if (!this._buyer.phone.match(/\+7\d{10}/)) {
            result.phone = "Пожалуйста, введите телефон в формате +79991234567"
        }
        if (this._buyer.address === '') {
            result.address = "Пожалуйста, укажите адрес доставки"
        }
        if (!this._buyer.email.match(/\w+@\w+\.\w+/)) {
            result.email = "Пожалуйста, укажите корректный email"
        }
        return result;
    }


}