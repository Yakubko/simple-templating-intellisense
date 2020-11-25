import Register from '../src/Register';
import EventsInterface from '../src/EventsInterface';
import { IntellisenseData } from '../src/types';

describe('STIntellisense Register', () => {
    // https://ilikekillnerds.com/2020/02/testing-event-listeners-in-jest-without-using-a-library/

    it('Create register', () => {
        const register = new Register('default');

        expect(register).toBeInstanceOf(Register);
    });

    it('Store data to register', () => {
        const register = new Register('default');
        const data: IntellisenseData = { id: { title: 'ID', description: 'ID description' } };
        register.data(data);

        expect(register.data()).toBe(data);
    });

    it('Add input element', () => {
        const register = new Register('default');
        const input = document.createElement('input');

        register.add(input);
        const elements = register.elements();

        expect(elements).toHaveLength(1);
        expect(elements[0]).toBeInstanceOf(EventsInterface);
    });

    it('Add same input twice', () => {
        const register = new Register('default');
        const input = document.createElement('input');

        register.add(input);
        register.add(input);
        const elements = register.elements();

        expect(elements).toHaveLength(1);
    });

    it('Remove input', () => {
        const register = new Register('default');
        const input = document.createElement('input');
        register.add(input);

        register.remove(input);
        const elements = register.elements();

        expect(elements).toHaveLength(0);
    });

    it('Remove input when is registered more inputs', () => {
        const register = new Register('default');
        const inputA = document.createElement('input');
        const inputB = document.createElement('input');
        register.add(inputA);
        register.add(inputB);

        let elements = register.elements();
        expect(elements).toHaveLength(2);

        register.remove(inputA);
        elements = register.elements();
        expect(elements).toHaveLength(1);
    });

    it('Clean register', () => {
        const register = new Register('default');

        const data: IntellisenseData = { id: { title: 'ID', description: 'ID description' } };
        register.data(data);

        const inputA = document.createElement('input');
        const inputB = document.createElement('input');
        register.add(inputA);
        register.add(inputB);

        let elements = register.elements();
        expect(elements).toHaveLength(2);
        expect(register.data()).toBe(data);

        register.clean();
        elements = register.elements();

        expect(elements).toHaveLength(0);
        expect(register.data()).toEqual({});
    });
});
