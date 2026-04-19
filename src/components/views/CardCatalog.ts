import {IEvents} from "../base/Events.ts";

import {Card} from "./Card.ts";
import {CategoryMapKey, IProduct} from "../../types";
import {ensureElement} from "../../utils/utils.ts";
import {categoryMap} from "../../utils/constants.ts";

type ICardCatalog = Pick<IProduct, 'image' | 'category'>

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement
    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, onClickAction: () => void) {
        super('card-catalog');
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardButtonElement = this.container as HTMLButtonElement;

        this.cardButtonElement.addEventListener('click', onClickAction);
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

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
        }
    }

}

