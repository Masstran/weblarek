import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";

type IForm = {formErrors: string, buttonIsActive: boolean}


export class Form<T> extends Template<IForm & T> {
    protected submitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;

    constructor(protected events: IEvents, templateId: string, buttonEvent: string) {
        super(templateId);


        this.submitButtonElement = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.submitButtonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit(buttonEvent);
        });

    }

    set formErrors(value: string) {
        this.formErrorsElement.textContent = value;
    }

    set buttonIsActive(value: boolean | null) {
        this.submitButtonElement.disabled = !(value ?? false);
    }
}

