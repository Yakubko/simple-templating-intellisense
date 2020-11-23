import STIntellisense from '../src';

describe('STIntellisense', () => {
    it('list', () => {
        const register = STIntellisense.getRegister();
        const list = { user: { name: 'user', title: 'User' } };
        register.data(list);

        expect(register.data()).toBe(list);
    });

    // ...remaining tests...
});
