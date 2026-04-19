import {IProduct} from "../../types";
import {Template} from "./Template.ts";
import {ensureElement} from "../../utils/utils.ts";

type ICard = Pick<IProduct, 'title' | 'price'>

export class Card<T> extends Template<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;


    constructor(templateId: string) {
        super(templateId);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
        }
    }

}

