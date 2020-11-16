import List from './List';
import { AllowedElements } from './types';

export default class EventInterface {
    private element: AllowedElements;
    private registerName: string;

    private state: { ignoreOneTimeKeyUpEvent: boolean } = { ignoreOneTimeKeyUpEvent: false };
    private scrollableElements: (HTMLElement | Window)[] = [];

    constructor(element: AllowedElements, registerName: string) {
        this.element = element;
        this.registerName = registerName;

        this.element.addEventListener('focus', this, false);
    }

    unbind(): void {
        this.element.removeEventListener('focus', this, false);
    }

    getElement(): AllowedElements {
        return this.element;
    }

    handleEvent(event: Event): void {
        switch (event.type) {
            case 'focus':
                this.focus();
                break;

            case 'mouseup':
                this.resize();
                break;

            case 'blur':
                this.blur();
            case 'click':
            case 'scroll':
                List.hide();
                break;

            case 'keyup':
                this.keyup(event as KeyboardEvent);
                break;

            case 'keydown':
                this.keydown(event as KeyboardEvent);
                break;
        }
    }

    private focus(): void {
        this.element.addEventListener('blur', this, false);
        this.element.addEventListener('click', this, false);
        this.element.addEventListener('keyup', this, false);
        this.element.addEventListener('keydown', this, false);

        if (this.element.nodeName === 'TEXTAREA') {
            this.element.addEventListener('scroll', this, false);
            this.element.addEventListener('mouseup', this, false);
            this.element.dataset.stiWidth = this.element.clientWidth + '';
            this.element.dataset.stiHeight = this.element.clientHeight + '';
        }

        this.scrollableElements = this.getScrollableParents(this.element.parentElement);
        this.scrollableElements.forEach((el) => {
            el.addEventListener('scroll', this, false);
        });

        List.attach(this.element, this.registerName);
    }

    private blur() {
        this.element.removeEventListener('blur', this, false);
        this.element.removeEventListener('click', this, false);
        this.element.removeEventListener('keyup', this, false);
        this.element.removeEventListener('keydown', this, false);

        if (this.element.nodeName === 'TEXTAREA') {
            this.element.removeEventListener('scroll', this, false);
            this.element.removeEventListener('mouseup', this, false);
            delete this.element.dataset.stiWidth;
            delete this.element.dataset.stiHeight;
        }

        this.scrollableElements.forEach((el) => {
            el.removeEventListener('scroll', this, false);
        });

        List.detach();
    }

    private resize(): void {
        if (this.element.clientWidth !== parseInt(this.element.dataset.stiWidth) || this.element.clientHeight !== parseInt(this.element.dataset.stiHeight)) {
            this.element.dataset.stiWidth = this.element.clientWidth + '';
            this.element.dataset.stiHeight = this.element.clientHeight + '';
            List.attach(this.element, this.registerName);
        }
    }

    private keyup(event: KeyboardEvent): void {
        if (this.state.ignoreOneTimeKeyUpEvent) {
            this.state.ignoreOneTimeKeyUpEvent = false;
            return;
        }

        if (event.key === 'Escape') {
            List.hide();
            return;
        }

        const { value, selectionStart: caretPosition } = this.element;
        if (event.key === '{' && value.substr(caretPosition - 2, 2) === '{{') {
            this.state.ignoreOneTimeKeyUpEvent = true;
            this.addValueString('}}', true);
        }

        const bracketActiveWord = this.getBracketActiveWord();
        if (bracketActiveWord !== null) {
            List.show(bracketActiveWord);
        } else {
            List.hide();
        }
    }

    private keydown(event: KeyboardEvent): void {
        if (List.isVisible() && ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            this.state.ignoreOneTimeKeyUpEvent = true;
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) event.preventDefault();

            if (['ArrowRight', 'ArrowLeft', 'Enter'].includes(event.key)) {
                if (event.key === 'Enter') {
                    const selected = List.select();

                    this.addValueString(selected.autocomplete);
                }

                List.hide();
            }

            if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                List.select(event.key === 'ArrowUp' ? 'up' : 'down');
            }
        }
    }

    private addValueString(addValue: string, fixedSelection = false): void {
        const { value, selectionStart, selectionEnd } = this.element;
        this.element.value = [value.slice(0, selectionStart), addValue, value.slice(selectionEnd)].join('');
        this.element.selectionStart = this.element.selectionEnd = fixedSelection ? selectionStart : selectionStart + addValue.length;
    }

    private getBracketActiveWord(): string | null {
        const { value, selectionStart } = this.element;
        let valueInBrackets = null;
        let [startIndex, endIndex] = [value.lastIndexOf('{{', selectionStart - 2), value.indexOf('}}', selectionStart)];

        if (startIndex >= 0 && endIndex > 0) {
            const [startIndexReverse, endIndexReverse] = [value.lastIndexOf('}}', selectionStart - 2), value.indexOf('{{', selectionStart)];
            if (startIndexReverse < startIndex && (endIndexReverse === -1 || endIndex < endIndexReverse)) {
                const [startSpacePosition, endSpacePosition] = [value.lastIndexOf(' ', selectionStart - 1), value.indexOf(' ', selectionStart)];
                startIndex = startSpacePosition > startIndex ? startSpacePosition + 1 : startIndex + 2;
                endIndex = endSpacePosition < endIndex && endSpacePosition !== -1 ? endSpacePosition : endIndex;
                valueInBrackets = value.substr(startIndex, endIndex - startIndex);
            }
        }
        return valueInBrackets;
    }

    private getScrollableParents(element: HTMLElement, data: (HTMLElement | Window)[] = []): (HTMLElement | Window)[] {
        if (element == null) return data;
        if (element === document.body) {
            data.push(window);
            return data;
        }

        if (element.scrollHeight > element.clientHeight) {
            data.push(element);
        }

        return this.getScrollableParents(element.parentElement, data);
    }
}
