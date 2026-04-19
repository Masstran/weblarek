import {Component} from "../base/Component.ts";
import {cloneTemplate, ensureElement} from "../../utils/utils.ts";

export class Template<T> extends Component<T>{

    constructor(templateId: string) {
        const template = ensureElement<HTMLTemplateElement>(`#${templateId}`)

        super(cloneTemplate(template));
    }
}