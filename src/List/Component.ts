import { AllowedElements, IntellisenseObject } from '../types';

import './style.css';

export type IntellisenseList = { name: string; autocomplete: string; object: IntellisenseObject };

type MeasurementsHelpers = {
    textArea: HTMLTextAreaElement;
    fontCanvasCtx: CanvasRenderingContext2D;
};

type ListDom = {
    mainElement: HTMLElement;
    ulElement: HTMLElement;
    detailElement: HTMLElement;
};

class Component {
    protected dom: ListDom = { mainElement: null, ulElement: null, detailElement: null };
    protected element: AllowedElements | null;
    protected measurementsHelpers: MeasurementsHelpers;

    constructor() {
        this.createDom();
        this.createHelpers();
    }

    attach(element: AllowedElements): void {
        if (this.element && !element.isSameNode(this.element)) this.detach();

        this.element = element;

        const { fontCanvasCtx, textArea } = this.measurementsHelpers;
        const computedStyle = window.getComputedStyle(this.element);

        const zIndex = this.getClosestZIndex(this.element);
        this.dom.mainElement.style.zIndex = zIndex ? (zIndex + 1).toString() : 'auto';

        const { fontSize, fontFamily } = computedStyle;
        const fontSpec = `${fontSize} ${fontFamily || 'sans-serif'}`;
        if (fontCanvasCtx.font !== fontSpec) fontCanvasCtx.font = fontSpec;

        if (this.element.nodeName === 'TEXTAREA') {
            const { paddingRight, paddingLeft, lineHeight, font, letterSpacing, whiteSpace, wordBreak, wordSpacing, wordWrap } = computedStyle;
            ((attributes) => {
                for (const name in attributes) {
                    textArea.style[name] = attributes[name];
                }
            })({
                width: this.element.clientWidth - parseInt(paddingLeft) - parseInt(paddingRight) + 'px',
                paddingLeft,
                paddingRight,
                font,
                fontSize,
                fontFamily,
                lineHeight,
                letterSpacing,
                whiteSpace,
                wordBreak,
                wordSpacing,
                wordWrap,
            });
        }
    }

    detach(): void {
        this.element = null;
        this.renderList([]);
    }

    isVisible(): boolean {
        return this.dom.mainElement.style.display === 'inline-flex';
    }

    select(index: number, detail: IntellisenseList): void {
        this.dom.detailElement.innerHTML = `${detail.object.title || detail.name}<br/><hr/>${detail.object.description || ''}`;

        if (this.dom.ulElement.dataset.stiSelected && this.dom.ulElement.children[this.dom.ulElement.dataset.stiSelected]) {
            this.dom.ulElement.children[this.dom.ulElement.dataset.stiSelected].classList.remove('ui-state-focus');
        }

        if (this.dom.ulElement.children[index]) {
            this.dom.ulElement.dataset.stiSelected = index + '';
            this.dom.ulElement.children[index].classList.add('ui-state-focus');
            this.dom.ulElement.children[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }

    renderList(data: IntellisenseList[]): void {
        delete this.dom.ulElement.dataset.stiSelected;

        if (data.length > 0) {
            this.dom.mainElement.style.display = 'inline-flex';
            this.dom.ulElement.innerHTML = data.map((item) => `<li>${item.name}</li>`).join('');

            this.align();
            this.select(0, data[0]);
        } else {
            this.dom.ulElement.innerHTML = '';
            this.dom.mainElement.style.display = 'none';
        }
    }

    private align(): void {
        const { left, top } = this.getCaretPosition();

        this.dom.mainElement.style.left = `${left}px`;
        this.dom.mainElement.style.top = `${top}px`;
    }

    private createDom(): void {
        this.dom.mainElement = document.createElement('div');
        this.dom.mainElement.id = 'sti-body';

        this.dom.ulElement = document.createElement('ul');
        this.dom.ulElement.className = 'sti-list';

        this.dom.detailElement = document.createElement('div');
        this.dom.detailElement.className = 'sti-detail';

        this.dom.mainElement.appendChild(this.dom.ulElement);
        this.dom.mainElement.appendChild(this.dom.detailElement);

        document.addEventListener('DOMContentLoaded', () => {
            window.document.body.appendChild(this.dom.mainElement);
        });
    }

    private createHelpers(): void {
        this.measurementsHelpers = {
            textArea: document.createElement('textarea'),
            fontCanvasCtx: document.createElement('canvas').getContext('2d'),
        };
        ((attributes) => {
            for (const name in attributes) {
                this.measurementsHelpers.textArea.style[name] = attributes[name];
            }
        })({ border: 'none', height: '0', overflow: 'hidden', padding: '0', position: 'absolute', left: '0', top: '0', zIndex: '-1' });
        this.dom.mainElement.appendChild(this.measurementsHelpers.textArea);
    }

    private getClosestZIndex(element: HTMLElement, data = 0): number {
        if (element == null || element === document.body) return data;

        data = Math.max(data, parseInt(window.getComputedStyle(element).zIndex) || 0);

        return this.getClosestZIndex(element.parentElement, data);
    }

    private getCaretPosition(): { left: number; top: number } {
        const { left: boundingLeft, top: boundingTop } = this.element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this.element);

        const { value, selectionStart } = this.element;
        const { fontCanvasCtx, textArea } = this.measurementsHelpers;
        const { fontSize, paddingLeft, paddingTop } = computedStyle;

        let text = value.substr(0, selectionStart);
        let height = parseInt(fontSize);
        let top = height;
        switch (this.element.nodeName) {
            case 'TEXTAREA':
                const { lineHeight } = computedStyle;
                height = parseInt(lineHeight) || height;

                textArea.value = text;
                const lines = Math.floor((textArea.scrollHeight - this.element.scrollTop) / height) || 1;

                top = lines * height + Math.floor(this.element.scrollTop % height) + 5;
                text = text.substr(text.lastIndexOf('\n') + 1);
                textArea.value = text;

                let newSelectionStart = 0;
                const textAreaScrollHeight = textArea.scrollHeight;
                do {
                    newSelectionStart = textArea.value.lastIndexOf(' ');
                    textArea.value = textArea.value.substr(0, newSelectionStart);
                } while (textAreaScrollHeight === textArea.scrollHeight && newSelectionStart > 0);

                text = text.substr(newSelectionStart + 1);
                break;

            case 'INPUT':
                top += 10;
                break;
        }

        return {
            left: boundingLeft + Math.round(fontCanvasCtx.measureText(text).width) - this.element.scrollLeft + parseInt(paddingLeft),
            top: boundingTop + top + parseInt(paddingTop),
        };
    }
}

export default new Component();
