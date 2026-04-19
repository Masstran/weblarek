import {EventNames, IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IBuyer, TPayment} from "../../types";
import {Form} from "./Form.ts";

type IOrder = Pick<IBuyer, "payment" | "address">

export class Order extends Form<IOrder> {
    protected cardPaymentButtonElement: HTMLButtonElement;
    protected cashPaymentButtonElement: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
        super(events, 'order', EventNames.ORDER_SUBMIT)

        this.cardPaymentButtonElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashPaymentButtonElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardPaymentButtonElement.addEventListener('click', () => {
            this.events.emit(EventNames.PAYMENT_CARD);
        });

        this.cashPaymentButtonElement.addEventListener('click', () => {
            this.events.emit(EventNames.PAYMENT_CASH);
        });

        this.addressInputElement.addEventListener("change", () => {
            this.events.emit(EventNames.ADDRESS_INPUT, {value: this.addressInputElement.value});
        })

    }

    set payment(value: TPayment) {
        this.cardPaymentButtonElement.classList.remove("button_alt-active");
        this.cashPaymentButtonElement.classList.remove("button_alt-active");
        switch (value) {
            case "cash": {
                this.cashPaymentButtonElement.classList.add("button_alt-active");
                break;
            }
            case "card": {
                this.cardPaymentButtonElement.classList.add("button_alt-active");
                break;
            }
        }
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }

}

