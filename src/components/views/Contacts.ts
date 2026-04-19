import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";
import {IBuyer} from "../../types";

type IContacts = Omit<IBuyer, "address" | "payment"> & {formErrors?: HTMLElement[], buttonIsActive?: boolean}

export class Contacts extends Template<IContacts> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;
    protected submitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;

    constructor(protected events: IEvents) {
        super('contacts')

        this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.submitButtonElement = ensureElement<HTMLButtonElement>('.button', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.submitButtonElement.addEventListener('click', () => {
            this.events.emit('contacts:submit', {
                email: this.emailInputElement.value,
                phone: this.phoneInputElement.value
            });
        });

        this.emailInputElement.addEventListener("input", () => {
            this.events.emit("contacts:email:input", {value: this.emailInputElement.value});
        });

        this.phoneInputElement.addEventListener("input", () => {
            this.events.emit("contacts:phone:input", {value: this.phoneInputElement.value});
        });

    }

    set email(value: string) {
        this.emailInputElement.textContent = value;
    }

    // Should it be here? Kind of feels like it's just user input, not some data we show...
    set phone(value: string) {
        this.phoneInputElement.textContent = value;
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

