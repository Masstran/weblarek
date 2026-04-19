import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
interface IGallery {
    gallery: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.catalogElement = this.container;
    }

    set gallery(items: HTMLElement[]) {
        this.catalogElement.innerHTML = "";
        items.forEach(i => {
            this.catalogElement.append(i);
        })

    }
}

