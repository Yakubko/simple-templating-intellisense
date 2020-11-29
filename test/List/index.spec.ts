import STIntellisense from '../../src';
import List from '../../src/List';
import ListComponent from '../../src/List/Component';

describe('STIntellisense List', () => {
    const globalRegister = STIntellisense.getRegister('default');
    globalRegister.data({ id: { title: 'ID' }, name: {}, user: { nestedData: { a: {}, b: {}, bb: {} } } });

    it('Attach element to List', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');

        expect(List['forRegister']).toBe('default');
        expect(List['selectedIndex']).toBe(0);
        expect(ListComponent['element']).toBe(input);
    });

    it('Detach element from List', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.detach();

        expect(List['forRegister']).toBeNull();
        expect(List['selectedIndex']).toBe(0);
        expect(ListComponent['element']).toBeNull();
    });

    it('Show List', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(3);
    });

    it('Show List with filter', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('n');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(1);
    });

    it('Show List with nested filter', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('user.');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(3);

        List.show('user.a');

        expect(List.isVisible()).toBeFalsy();

        List.show('user.a.a');

        expect(List.isVisible()).toBeFalsy();

        List.show('user.b');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(2);

        List.show('user.c');

        expect(List.isVisible()).toBeFalsy();
    });

    it('Hide List', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(3);

        List.hide();
        expect(List.isVisible()).toBeFalsy();
    });

    it('Select current item', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('');
        const selected = List.select();

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(3);
        expect(selected.name).toBe('id');
    });

    it('Select next item', () => {
        const input = document.createElement('input');
        List.attach(input, 'default');
        List.show('');

        expect(List.isVisible()).toBeTruthy();
        expect(List['visibleData']).toHaveLength(3);
        expect(List['selectedIndex']).toBe(0);

        let selected = List.select('down');
        expect(List['selectedIndex']).toBe(1);
        expect(selected.name).toBe('name');

        selected = List.select('down');
        expect(List['selectedIndex']).toBe(2);
        expect(selected.name).toBe('user');

        selected = List.select('down');
        expect(List['selectedIndex']).toBe(0);
        expect(selected.name).toBe('id');

        selected = List.select('up');
        expect(List['selectedIndex']).toBe(2);
        expect(selected.name).toBe('user');
    });
});
