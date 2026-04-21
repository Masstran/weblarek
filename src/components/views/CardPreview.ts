import {EventNames, IEvents} from "../base/Events.ts";
import {Card} from "./Card.ts";
import {ensureElement} from "../../utils/utils.ts";
import {CategoryMapKey, IProduct} from "../../types";
import {categoryMap} from "../../utils/constants.ts";


type ICardPreview = Pick<IProduct, 'image' | 'category' | 'description'> & {buttonDisabled: boolean, buttonText: string}


export class CardPreview extends Card<ICardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement
    protected textElement: HTMLElement;
    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        super('card-preview');

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButtonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.cardButtonElement.addEventListener("click", () => {
            events.emit(EventNames.PREVIEW_TOGGLE)
        });
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

    set description(value: string) {
        if (this.textElement) {
            this.textElement.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        this.cardButtonElement.disabled = value;
    }

    set buttonText(value: string) {
        this.cardButtonElement.textContent = value;
    }

}

