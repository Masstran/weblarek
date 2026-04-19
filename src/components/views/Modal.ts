import {Component} from "../base/Component.ts";
import {EventNames, IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IModal {
    content: HTMLElement;
    active: boolean;
}

export class Modal extends Component<IModal> {
    protected modalContentElement: HTMLElement;
    protected closeButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.modalContentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButtonElement.addEventListener('click', () => {
            this.events.emit(EventNames.CLOSE_MODAL);
        });
    }

    set active(isActive: boolean) {
        if (isActive) {
            this.container.classList.add("modal_active");
        } else {
            this.container.classList.remove("modal_active");
        }
    }

    set content(element: HTMLElement) {
        this.modalContentElement.replaceChildren(element);
    }
}

