import List, { ListData } from './List';
import EventsInterface from './EventsInterface';

import { AllowedElements } from './types';

export default class Register {
    private name: string;
    private elements: EventsInterface[] = [];

    constructor(name: string) {
        this.name = name;
    }

    data(data?: ListData): ListData {
        return List.data(this.name, data);
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
}
