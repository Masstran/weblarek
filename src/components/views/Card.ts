import {IProduct} from "../../types";
import {Template} from "./Template.ts";
import {categoryMap} from "../../utils/constants.ts";

type ICard = Omit<IProduct, 'id'> & {inBasket?: boolean}

type CategoryMapKey = keyof typeof categoryMap;

export class Card extends Template<ICard> {
    protected categoryElement: HTMLElement | null;
    protected titleElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;
    protected priceElement: HTMLElement | null;
    protected textElement: HTMLElement | null;


    constructor(templateId: string) {
        super(templateId);

        this.categoryElement = this.container.querySelector('.card__category');
        this.titleElement = this.container.querySelector('.card__title');
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement | null;
        this.priceElement = this.container.querySelector('.card__price');
        this.textElement = this.container.querySelector('.card__text');
    }

    set category(value: CategoryMapKey) {
        if (this.categoryElement === null) {
            return;
        }
        this.categoryElement.className = '';
        this.categoryElement.classList.add("card__category")
        this.categoryElement.classList.add(categoryMap[value]);
        this.categoryElement.textContent = value;
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
        }
    }

    set description(value: string) {
        if (this.textElement) {
            this.textElement.textContent = value;
        }
    }
}

