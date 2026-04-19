import {IEvents} from "../base/Events.ts";

import {Card} from "./Card.ts";

export class CardCatalog extends Card {

    protected cardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, onClickAction: () => void) {
        super('card-catalog');
        this.cardButtonElement = this.container as HTMLButtonElement;

        this.cardButtonElement.addEventListener('click', onClickAction);
    }

}

