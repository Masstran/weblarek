import {EventNames, IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {Template} from "./Template.ts";

interface IBasket {
    products: HTMLElement[];
    price: number;
}

export class Basket extends Template<IBasket> {
    protected priceElement: HTMLElement;
    protected listElement: HTMLElement;
    protected orderButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        super('basket')

        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderButtonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButtonElement.addEventListener('click', () => {
            this.events.emit(EventNames.BASKET_ORDER);
        });
    }

    set price(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set products(items: HTMLElement[]) {
        this.listElement.innerHTML = '';
        items.forEach(i => this.listElement.append(i));
        this.orderButtonElement.disabled = items.length === 0;
    }
}

