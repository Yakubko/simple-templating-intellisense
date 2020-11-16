import EventsInterface from './EventsInterface';

import { AllowedElements, IntellisenseData } from './types';

export default class Register {
    private name: string;
    private _data: IntellisenseData;
    private elements: EventsInterface[] = [];

    constructor(name: string) {
        this.name = name;
    }

    data(data?: IntellisenseData): IntellisenseData {
        if (data) this._data = data;

        return this._data;
    }

    add(element: AllowedElements): void {
        if (
            !this.elements.some((el) => {
                return el.getElement().isSameNode(element);
            })
        ) {
            this.elements.push(new EventsInterface(element, this.name));
        }
    }

    remove(element: AllowedElements): void {
        this.elements = this.elements.filter((el) => {
            if (el.getElement().isSameNode(element)) {
                el.unbind();
                return false;
            }

            return true;
        });
    }

    clean(): void {
        this.elements.forEach((elementInterface) => {
            this.remove(elementInterface.getElement());
        });

        this.elements = [];
    }
}
