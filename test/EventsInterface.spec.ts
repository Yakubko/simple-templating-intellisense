import EventsInterface from '../src/EventsInterface';
import { AllowedElements } from '../src/types';
import List from '../src/List';
import STIntellisense from '../src';

describe('STIntellisense EventsInterface', () => {
    let input: HTMLInputElement;
    let textarea: HTMLTextAreaElement;
    let events: Record<string, EventsInterface> = {};

    const globalRegister = STIntellisense.getRegister('default');
    globalRegister.data({ id: { title: 'ID' }, name: {} });

    const mockEventListener = (element: AllowedElements) => {
        element.addEventListener = jest.fn((type, listener) => {
            events[type as string] = listener as EventsInterface;
        });
        element.removeEventListener = jest.fn((type) => {
            delete events[type as string];
        });
    };

    beforeAll(() => {
        window.document.body.innerHTML =
            '<div id="parent-div"><div id="scrollable-div" style="width: 50px; height: 50px; overflow: scroll;">' +
            "The overflow property specifies whether to clip content or to add scrollbars when an element's content is too big to fit in a specified area." +
            '</div></div>';
    });

    beforeEach(() => {
        input = document.createElement('input');
        textarea = document.createElement('textarea');

        mockEventListener(input);
        mockEventListener(textarea);

        window.document.body.appendChild(input);
        window.document.body.appendChild(textarea);
    });

    afterEach(() => {
        events = {};

        input.remove();
        textarea.remove();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        window.document.body.innerHTML = '';
    });

    it('Create events interface with input', () => {
        const ei = new EventsInterface(input, 'default');

        expect(ei.getElement()).toBe(input);
    });

    it('Dispatch event focus/blur for input', () => {
        new EventsInterface(input, 'default');
        const eventBlur = new Event('blur');
        const eventFocus = new Event('focus');

        expect(Object.keys(events)).toEqual(['focus']);

        events.focus.handleEvent(eventFocus);

        expect(Object.keys(events)).toEqual(['focus', 'blur', 'click', 'keydown', 'keyup']);

        events.focus.handleEvent(eventBlur);

        expect(Object.keys(events)).toEqual(['focus']);
    });

    it('Create events interface with textarea', () => {
        const ei = new EventsInterface(textarea, 'default');

        expect(ei.getElement()).toBe(textarea);
    });

    it('Dispatch event focus/blur for textarea', () => {
        new EventsInterface(textarea, 'default');
        const eventBlur = new Event('blur');
        const eventFocus = new Event('focus');

        expect(Object.keys(events)).toEqual(['focus']);

        events.focus.handleEvent(eventFocus);

        expect(Object.keys(events)).toEqual(['focus', 'blur', 'click', 'keydown', 'keyup', 'scroll', 'mouseup']);
        expect(textarea.dataset.stiWidth).toBe('0');
        expect(textarea.dataset.stiHeight).toBe('0');

        events.focus.handleEvent(eventBlur);

        expect(Object.keys(events)).toEqual(['focus']);
        expect(textarea.dataset.stiWidth).toBeUndefined();
        expect(textarea.dataset.stiHeight).toBeUndefined();
    });

    it('Dispatch event focus for input in/outside scrollable content', () => {
        const eventFocus = new Event('focus');

        let ei = new EventsInterface(input, 'default');
        events.focus.handleEvent(eventFocus);

        expect(ei.getScrollableElements()).toHaveLength(1);

        const inputInScrollableContent = document.createElement('input');
        mockEventListener(inputInScrollableContent);

        const scrollableDiv = window.document.getElementById('scrollable-div');
        jest.spyOn(scrollableDiv, 'clientHeight', 'get').mockImplementation(() => 50);
        jest.spyOn(scrollableDiv, 'scrollHeight', 'get').mockImplementation(() => 100);

        scrollableDiv.appendChild(inputInScrollableContent);

        ei = new EventsInterface(inputInScrollableContent, 'default');

        events.focus.handleEvent(eventFocus);

        expect(ei.getScrollableElements()).toHaveLength(2);

        inputInScrollableContent.remove();
    });

    it("Dispatch event focus for input which isn't attached to body", () => {
        const eventFocus = new Event('focus');
        const inputInScrollableContent = document.createElement('input');
        mockEventListener(inputInScrollableContent);

        const ei = new EventsInterface(inputInScrollableContent, 'default');

        events.focus.handleEvent(eventFocus);

        expect(ei.getScrollableElements()).toHaveLength(0);

        inputInScrollableContent.remove();
    });

    it('Dispatch event resize(mouseup) for textarea', () => {
        new EventsInterface(textarea, 'default');
        const eventFocus = new Event('focus');
        const eventMouseup = new Event('mouseup');
        events.focus.handleEvent(eventFocus);

        let spy = jest.spyOn(textarea, 'clientWidth', 'get').mockImplementation(() => 50);
        events.mouseup.handleEvent(eventMouseup);
        spy.mockClear();

        expect(textarea.dataset.stiWidth).toBe('50');
        expect(textarea.dataset.stiHeight).toBe('0');

        spy = jest.spyOn(textarea, 'clientHeight', 'get').mockImplementation(() => 50);
        events.mouseup.handleEvent(eventMouseup);
        spy.mockClear();

        expect(textarea.dataset.stiWidth).toBe('50');
        expect(textarea.dataset.stiHeight).toBe('50');

        events.mouseup.handleEvent(eventMouseup);
        expect(textarea.dataset.stiWidth).toBe('50');
        expect(textarea.dataset.stiHeight).toBe('50');
    });

    it('Dispatch event keyup for input', () => {
        new EventsInterface(input, 'default');
        const eventFocus = new Event('focus');
        let eventKeyup = new KeyboardEvent('keyup', { key: '{' });
        events.focus.handleEvent(eventFocus);

        input.value = 'hi { test';
        input.selectionStart = input.selectionEnd = 4;

        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeFalsy();

        input.value = 'hi {{ test';
        input.selectionStart = input.selectionEnd = 5;

        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeTruthy();
        expect(input.value).toBe('hi {{}} test');

        input.value = 'hi {{test}} and {{i}} {{test + na }}';

        input.selectionStart = input.selectionEnd = 9;
        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeFalsy();

        input.selectionStart = input.selectionEnd = 13;
        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeFalsy();

        input.selectionStart = input.selectionEnd = 19;
        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeTruthy();
        let selected = List.select();
        expect(selected.name).toBe('id');
        expect(selected.autocomplete).toBe('d');

        input.selectionStart = input.selectionEnd = 33;
        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeTruthy();
        selected = List.select();
        expect(selected.name).toBe('name');
        expect(selected.autocomplete).toBe('me');

        eventKeyup = new KeyboardEvent('keyup', { key: 'Escape' });
        events.keyup.handleEvent(eventKeyup);
        expect(List.isVisible()).toBeFalsy();
    });

    it('Dispatch event keydown for input', () => {
        input.value = 'hi {{ test';
        input.selectionStart = input.selectionEnd = 5;

        new EventsInterface(input, 'default');
        const eventFocus = new Event('focus');
        let eventKeyup = new KeyboardEvent('keyup', { key: '{' });
        let eventKeydown = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        events.focus.handleEvent(eventFocus);
        events.keyup.handleEvent(eventKeyup);

        expect(input.value).toBe('hi {{}} test');
        expect(List.isVisible()).toBeTruthy();
        let selected = List.select();
        expect(selected.name).toBe('id');
        expect(selected.autocomplete).toBe('id');

        eventKeyup = new KeyboardEvent('keyup', { key: 'ArrowDown' });
        events.keydown.handleEvent(eventKeydown);
        events.keyup.handleEvent(eventKeyup);
        selected = List.select();
        expect(selected.name).toBe('name');
        expect(selected.autocomplete).toBe('name');

        eventKeydown = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        events.keydown.handleEvent(eventKeydown);
        selected = List.select();
        expect(selected.name).toBe('id');
        expect(selected.autocomplete).toBe('id');

        events.keydown.handleEvent(eventKeydown);
        selected = List.select();
        expect(selected.name).toBe('name');
        expect(selected.autocomplete).toBe('name');

        expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);

        eventKeydown = new KeyboardEvent('keydown', { key: 'Enter' });
        events.keydown.handleEvent(eventKeydown);
        expect(input.value).toBe('hi {{name}} test');
        expect([input.selectionStart, input.selectionEnd]).toEqual([9, 9]);
        expect(List.isVisible()).toBeFalsy();
    });

    it('Dispatch event keydown ArrowLeft/ArrowRight for input', () => {
        input.value = 'hi {{';
        input.selectionStart = input.selectionEnd = 5;

        new EventsInterface(input, 'default');
        const eventFocus = new Event('focus');
        const eventKeyup = new KeyboardEvent('keyup', { key: '{' });
        let eventKeydown = new KeyboardEvent('keydown', { key: 'ArrowLeft' });

        events.focus.handleEvent(eventFocus);
        events.keyup.handleEvent(eventKeyup);

        expect(input.value).toBe('hi {{}}');
        expect(List.isVisible()).toBeTruthy();

        events.keydown.handleEvent(eventKeydown);
        expect(List.isVisible()).toBeFalsy();

        eventKeydown = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        input.selectionStart = input.selectionEnd = 5;

        events.keyup.handleEvent(eventKeyup);
        events.keydown.handleEvent(eventKeydown);
        expect(List.isVisible()).toBeFalsy();
    });
});
