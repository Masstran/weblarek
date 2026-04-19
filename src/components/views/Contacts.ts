import {EventNames, IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IBuyer} from "../../types";
import {Form} from "./Form.ts";

type IContacts = Pick<IBuyer, "email" | "phone">

export class Contacts extends Form<IContacts> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
        super(events, 'contacts', EventNames.CONTACTS_SUBMIT);

        this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

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

    set phone(value: string) {
        this.phoneInputElement.value = value;
    }
}

