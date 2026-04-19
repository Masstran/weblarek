import {IEvents} from "../base/Events.ts";
import {Card} from "./Card.ts";
import {ensureElement} from "../../utils/utils.ts";


export class CardPreview extends Card {
    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, protected addToBasketAction: () => void, protected removeFromBasketAction: () => void) {
        super('card-preview');

        this.cardButtonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.cardButtonElement.textContent = "Недоступно";
            this.cardButtonElement.disabled = true;
        }
    }

    set inBasket(value: boolean) {
        if (this.cardButtonElement.disabled) {
            return
        }
        if (value) {
            this.cardButtonElement.textContent = "Удалить из корзины";
            this.cardButtonElement.removeEventListener("click", this.addToBasketAction);
            this.cardButtonElement.addEventListener("click", this.removeFromBasketAction);
        } else {
            this.cardButtonElement.textContent = "В корзину";
            this.cardButtonElement.removeEventListener("click", this.removeFromBasketAction);
            this.cardButtonElement.addEventListener("click", this.addToBasketAction);
        }
    }

}

