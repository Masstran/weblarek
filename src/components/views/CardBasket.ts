import {IEvents} from "../base/Events.ts";
import {Card} from "./Card.ts";
import {ensureElement} from "../../utils/utils.ts";


export class CardBasket extends Card {
    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, removeFromBasketAction: () => void) {
        super('card-basket');

        this.cardButtonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.cardButtonElement.addEventListener('click', removeFromBasketAction);
    }

}

