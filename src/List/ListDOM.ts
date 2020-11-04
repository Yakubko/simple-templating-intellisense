import { AllowedElements } from '../types';
import './style.css';

type MeasurementsHelpers = {
    textArea: HTMLTextAreaElement;
    fontCanvasCtx: CanvasRenderingContext2D;
};

export default class ListDOM {
    private ulElement: HTMLElement;
    private mainElement: HTMLElement;

    private measurementsHelpers: MeasurementsHelpers;

    constructor() {
        this.measurementsHelpers = {
            textArea: document.createElement('textarea'),
            fontCanvasCtx: document.createElement('canvas').getContext('2d'),
        };
        ((attributes) => {
            for (const name in attributes) {
                this.measurementsHelpers.textArea.style[name] = attributes[name];
            }
        })({ border: 'none', height: '0', overflow: 'hidden', padding: '0', position: 'absolute', left: '0', top: '0', zIndex: '-1' });

        this.mainElement = document.createElement('div');
        this.mainElement.className = 'a-body';

        this.ulElement = document.createElement('ul');
        this.ulElement.className = 'ui-autocomplete';

        this.mainElement.appendChild(this.ulElement);
        this.mainElement.appendChild(this.measurementsHelpers.textArea);

        document.addEventListener('DOMContentLoaded', () => {
            window.document.body.appendChild(this.mainElement);
        });
    }

    getElement(): HTMLElement {
        return this.mainElement;
    }

    bindData(data: string[]): void {
        this.ulElement.innerHTML = data.map((item, index) => '<li' + (index === 0 ? ' class="ui-state-focus"' : '') + '>' + item + '</li>').join('');
    }

    select(index: number): void {
        this.ulElement.getElementsByClassName('ui-state-focus')[0].classList.remove('ui-state-focus');

        this.ulElement.children[index].classList.add('ui-state-focus');
        this.ulElement.children[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }

    show(): void {
        this.mainElement.style.display = 'block';
    }

    hide(): void {
        this.ulElement.innerHTML = '';
        this.mainElement.style.display = 'none';
    }

    alignTo(element: AllowedElements): void {
        const { left, top } = element.getBoundingClientRect();
        const { left: caretLeft, top: caretTop } = this.getCaretPosition(element);

        this.mainElement.style.left = caretLeft + left + 'px';
        this.mainElement.style.top = top + caretTop + 'px';
    }

    private getCaretPosition(element: AllowedElements): { left: number; top: number } {
        const computedStyle = window.getComputedStyle(element);
        const { value, selectionStart } = element;
        const { fontCanvasCtx, textArea } = this.measurementsHelpers;

        let text = value.substr(0, selectionStart);
        const { fontSize, fontFamily, paddingLeft, paddingTop } = computedStyle;
        let height = parseInt(fontSize);
        let top = height;
        switch (element.nodeName) {
            case 'TEXTAREA':
                const { paddingRight, lineHeight, font, letterSpacing, whiteSpace, wordBreak, wordSpacing, wordWrap } = computedStyle;
                height = parseInt(lineHeight) || height;

                ((attributes) => {
                    for (const name in attributes) {
                        textArea.style[name] = attributes[name];
                    }
                })({ width: element.clientWidth - parseInt(paddingLeft) - parseInt(paddingRight) + 'px', font, fontSize, fontFamily, letterSpacing, whiteSpace, wordBreak, wordSpacing, wordWrap });

                textArea.value = text;
                const lines = Math.floor((textArea.scrollHeight - element.scrollTop) / height) || 1;
                top = lines * height + Math.floor(element.scrollTop % height) + 5;
                text = text.substr(text.lastIndexOf('\n') + 1);
                textArea.value = text;

                let newSelectionStart = -1;
                const textAreaScrollHeight = textArea.scrollHeight;
                while (textAreaScrollHeight === textArea.scrollHeight && Math.floor(textArea.scrollHeight / height) > 1) {
                    if (newSelectionStart > 200) break;
                    newSelectionStart = textArea.value.lastIndexOf(' ');
                    textArea.value = textArea.value.substr(0, textArea.value.lastIndexOf(' '));
                }
                text = text.substr(newSelectionStart + 1);
                break;

            case 'INPUT':
                top += 10;
                break;
        }

        const fontSpec = `${fontSize} ${fontFamily || 'sans-serif'}`;
        if (fontCanvasCtx.font !== fontSpec) fontCanvasCtx.font = fontSpec;

        return { left: Math.round(fontCanvasCtx.measureText(text).width) - element.scrollLeft + parseInt(paddingLeft), top: top + parseInt(paddingTop) };
    }
}
