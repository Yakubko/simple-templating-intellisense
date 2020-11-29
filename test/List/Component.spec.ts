import ListComponent, { IntellisenseList } from '../../src/List/Component';

describe('STIntellisense List Component', () => {
    const listData: IntellisenseList[] = [
        { name: 'id', autocomplete: 'id', object: { title: 'Id' } },
        { name: 'name', autocomplete: 'name', object: {} },
    ];

    afterEach(() => {
        jest.restoreAllMocks();

        window.document.body.innerHTML = '';
    });

    it('Component append to body', () => {
        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(event);

        expect(window.document.body.lastElementChild).toBe(ListComponent['dom'].mainElement);
    });

    it('Component attach input', () => {
        const input = document.createElement('input');
        input.style.fontSize = '11px';
        input.style.fontFamily = 'Arial';
        ListComponent.attach(input);

        expect(ListComponent['element']).toBe(input);
        expect(ListComponent['measurementsHelpers'].fontCanvasCtx.font).toBe(`${input.style.fontSize} ${input.style.fontFamily}`);
    });

    it('Component attach input with zIndex', () => {
        const input = document.createElement('input');
        input.style.zIndex = '10';

        ListComponent.attach(input);
        expect(ListComponent['dom'].mainElement.style.zIndex).toBe('11');
    });

    it('Component attach input with empty fontFamily', () => {
        const input = document.createElement('input');

        const original = window.getComputedStyle;
        const spyOn = jest.spyOn(window, 'getComputedStyle').mockImplementation(
            jest.fn((element) => {
                return { ...original(element), fontFamily: '', fontSize: '' };
            }),
        );

        ListComponent.attach(input);
        spyOn.mockRestore();

        expect(ListComponent['measurementsHelpers'].fontCanvasCtx.font).toBe('10px sans-serif');
    });

    it('Component attach textarea', () => {
        const textarea = document.createElement('textarea');
        ListComponent.attach(textarea);

        expect(ListComponent['element']).toBe(textarea);
    });

    it('Component detach', () => {
        const input = document.createElement('input');

        ListComponent.attach(input);
        expect(ListComponent['element']).toBe(input);

        ListComponent.detach();
        expect(ListComponent['element']).toBeNull();
    });

    it('Component select/renderList without attached element', () => {
        ListComponent.renderList(listData);
        expect(ListComponent.isVisible()).toBeFalsy();

        ListComponent.select(1, listData[1]);
        expect(ListComponent.isVisible()).toBeFalsy();
    });

    it('Component render list', () => {
        const input = document.createElement('input');
        ListComponent.attach(input);

        ListComponent.renderList(listData);
        expect(ListComponent.isVisible()).toBeTruthy();

        ListComponent.renderList([]);
        expect(ListComponent.isVisible()).toBeFalsy();
    });

    it('Component render list and select next item', () => {
        const textarea = document.createElement('textarea');
        textarea.value =
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";

        window.document.body.appendChild(textarea);

        textarea.getBoundingClientRect = jest.fn(() => {
            return { left: 10, top: 10, right: 500 } as DOMRect;
        });

        ListComponent.attach(textarea);
        ListComponent.renderList(listData);

        expect(ListComponent['dom'].ulElement.dataset.stiSelected).toBe('0');

        ListComponent.select(1, listData[1]);
        expect(ListComponent.isVisible()).toBeTruthy();
        expect(ListComponent['dom'].ulElement.dataset.stiSelected).toBe('1');
    });
});
