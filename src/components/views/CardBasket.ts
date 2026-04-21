import {IEvents} from "../base/Events.ts";
import {Card} from "./Card.ts";
import {ensureElement} from "../../utils/utils.ts";

interface ICardBasket {index: number}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, removeFromBasketAction: () => void) {
        super('card-basket');

        this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
        this.cardButtonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.cardButtonElement.addEventListener('click', removeFromBasketAction);
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }

}

