import {EventNames, IEvents} from "../base/Events.ts";
import {createElement, ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";
import {IBuyer, TPayment} from "../../types";

type IOrder = Omit<IBuyer, "email" | "phone"> & {formErrors?: string[], buttonIsActive?: boolean}

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

        this.submitButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit(EventNames.ORDER_SUBMIT);
        });

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

    // Should it be here? Kind of feels like it's just user input, not some data we show...
    set address(value: string) {
        this.addressInputElement.value = value;
    }

    set formErrors(items: string[] | null) {
        this.formErrorsElement.innerHTML = "";
        if (items) {
            items.forEach(i => {
                const element = createElement("p");
                element.textContent = i;
                this.formErrorsElement.append(element);
            });
            this.submitButtonElement.disabled = true;
        } else {
            this.submitButtonElement.disabled = false;
        }
    }

    set buttonIsActive(value: boolean | null) {
        this.submitButtonElement.disabled = !(value ?? false);
    }
}

