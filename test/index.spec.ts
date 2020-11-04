import Autocomplete from '../src';

describe('Autocomplete', () => {
    it('list', () => {
        const register = Autocomplete.getRegister();
        const list = { user: {} };
        register.data(list);

        expect(register.data()).toBe(list);
    });

    // ...remaining tests...
});
