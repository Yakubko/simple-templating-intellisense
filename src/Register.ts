import EventsInterface from './EventsInterface';

import { AllowedElements, IntellisenseData } from './types';

export default class Register {
    private name: string;
    private _data: IntellisenseData = {};
    private _elements: EventsInterface[] = [];

    constructor(name: string) {
        this.name = name;
    }

    data(data?: IntellisenseData): IntellisenseData {
        if (data) this._data = data;

        return this._data;
    }

    elements(): EventsInterface[] {
        return this._elements;
    }

    add(element: AllowedElements): void {
        if (
            !this._elements.some((el) => {
                return el.getElement().isSameNode(element);
            })
        ) {
            this._elements.push(new EventsInterface(element, this.name));
        }
    }

    remove(element: AllowedElements): void {
        this._elements = this._elements.filter((el) => {
            if (el.getElement().isSameNode(element)) {
                el.unbind();
                return false;
            }

            return true;
        });
    }

    clean(): void {
        this._elements.forEach((elementInterface) => {
            this.remove(elementInterface.getElement());
        });

        this._data = {};
        this._elements = [];
    }
}
