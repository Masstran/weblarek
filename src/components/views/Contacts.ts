import {EventNames, IEvents} from "../base/Events.ts";
import {createElement, ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";
import {IBuyer} from "../../types";

type IContacts = Omit<IBuyer, "address" | "payment"> & {formErrors?: string[], buttonIsActive?: boolean}

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

        this.submitButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit(EventNames.CONTACTS_SUBMIT);
        });

        this.emailInputElement.addEventListener("change", () => {
            this.events.emit(EventNames.EMAIL_INPUT, {value: this.emailInputElement.value});
        });

        this.phoneInputElement.addEventListener("change", () => {
            this.events.emit(EventNames.PHONE_INPUT, {value: this.phoneInputElement.value});
        });

    }

    set email(value: string) {
        this.emailInputElement.value = value;
    }

    // Should it be here? Kind of feels like it's just user input, not some data we show...
    set phone(value: string) {
        this.phoneInputElement.value = value;
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

