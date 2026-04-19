import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";
import {IBuyer, TPayment} from "../../types";

type IOrder = Omit<IBuyer, "email" | "phone"> & {formErrors?: HTMLElement[], buttonIsActive?: boolean}

export class Order extends Template<IOrder> {
    protected cardPaymentButtonElement: HTMLButtonElement;
    protected cashPaymentButtonElement: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;
    protected submitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;

    constructor(protected events: IEvents) {
        super('order')

        this.cardPaymentButtonElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashPaymentButtonElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.submitButtonElement = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.submitButtonElement.addEventListener('click', () => {
            const payment: TPayment = this.cardPaymentButtonElement.classList.contains("button_alt-active") ? "card" :
                this.cashPaymentButtonElement.classList.contains("button_alt-active") ? "cash" : "";
            this.events.emit('order:submit', {
                payment: payment,
                address: this.addressInputElement.value,
            });
        });

        this.cardPaymentButtonElement.addEventListener('click', () => {
            this.events.emit('order:payment:select:card');
        });

        this.cashPaymentButtonElement.addEventListener('click', () => {
            this.events.emit('order:payment:select:cash');
        });

        this.addressInputElement.addEventListener("input", () => {
            this.events.emit('order:address:input', {value: this.addressInputElement.value});
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

    // Should it be here? Kind of feels like it's just user input, not some data we show...
    set address(value: string) {
        this.addressInputElement.textContent = value;
    }

    set formErrors(items: HTMLElement[] | null) {
        this.formErrorsElement.innerHTML = "";
        if (items) {
            items.forEach(i => this.formErrorsElement.append(i));
            this.submitButtonElement.disabled = true;
        } else {
            this.submitButtonElement.disabled = false;
        }
    }

    set buttonIsActive(value: boolean | null) {
        this.submitButtonElement.disabled = !(value ?? false);
    }
}

