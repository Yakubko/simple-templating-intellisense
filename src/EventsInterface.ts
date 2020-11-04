import List from './List';
import { AllowedElements } from './types';

export default class EventInterface {
    private element: AllowedElements;
    private registerName: string;

    private state: { ignoreOneTimeKeyUpEvent: boolean } = { ignoreOneTimeKeyUpEvent: false };

    constructor(element: AllowedElements, registerName: string) {
        this.element = element;
        this.registerName = registerName;

        this.element.addEventListener('blur', this, false);
        this.element.addEventListener('focus', this, false);
        this.element.addEventListener('click', this, false);
        this.element.addEventListener('keyup', this, false);
        this.element.addEventListener('keydown', this, false);
    }

    unbind(): void {
        this.element.removeEventListener('blur', this, false);
        this.element.removeEventListener('focus', this, false);
        this.element.removeEventListener('click', this, false);
        this.element.removeEventListener('keyup', this, false);
        this.element.removeEventListener('keydown', this, false);
    }

    getElement(): AllowedElements {
        return this.element;
    }

    handleEvent(event: Event): void {
        switch (event.type) {
            case 'focus':
                List.attach(this.registerName, this.element);
                break;

            case 'blur':
                List.detach();
            case 'click':
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

    private keyup(event: KeyboardEvent): void {
        if (this.state.ignoreOneTimeKeyUpEvent) {
            this.state.ignoreOneTimeKeyUpEvent = false;
            return;
        }

        const { value, selectionStart: caretPosition } = this.element;
        if (event.type === 'keyup' && event.key === '{' && value.substr(caretPosition - 2, 2) === '{{') {
            this.state.ignoreOneTimeKeyUpEvent = true;
            this.addValueString('}}');
        }

        const bracketActiveWord = this.getBracketActiveWord();
        if (bracketActiveWord !== null) {
            List.filter(bracketActiveWord);

            const { visible, partialFilter, data } = List.getState();
            if (visible && (event.key === 'Backspace' || (event.key.length === 1 && event.key !== ' '))) {
                if (event.key !== 'Backspace') {
                    const addSuggestedString = data[0].substr(partialFilter.length);
                    if (addSuggestedString) {
                        this.addValueString(addSuggestedString, true);
                    }
                }

                List.align();
            }
        } else {
            List.hide();
        }
    }

    private keydown(event: KeyboardEvent): void {
        const { visible } = List.getState();
        if (visible && ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            this.state.ignoreOneTimeKeyUpEvent = true;
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) event.preventDefault();

            if (['ArrowRight', 'ArrowLeft', 'Enter'].includes(event.key)) {
                List.hide();

                if (event.key === 'Enter') {
                    if (this.element.selectionStart !== this.element.selectionEnd) this.element.selectionStart = this.element.selectionEnd;
                }
            }

            if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                List.selectByDirection(event.key === 'ArrowUp' ? 'up' : 'down');
                const { partialFilter, data, selectedIndex } = List.getState();
                const addSuggestedString = data[selectedIndex].substr(partialFilter.length);
                this.addValueString(addSuggestedString, true);
            }
        }
    }

    private addValueString(addValue: string, select = false): void {
        const { value, selectionStart, selectionEnd } = this.element;
        this.element.value = [value.slice(0, selectionStart), addValue, value.slice(selectionEnd)].join('');
        this.element.selectionStart = this.element.selectionEnd = selectionStart;
        if (select) {
            this.element.selectionEnd += addValue.length;
        }
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
}
