import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";

interface ISuccess {
    amount: number;
}

export class Success extends Template<ISuccess> {
    protected amountElement: HTMLElement;
    protected closeButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        super('success')

        this.amountElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButtonElement.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set amount(value: number) {
        this.amountElement.textContent = `Списано ${value} синапсов`;
    }
}

