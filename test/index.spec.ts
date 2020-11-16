import STIntellisense from '../src/index';

describe('STIntellisense', () => {
    it('list', () => {
        const register = STIntellisense.getRegister();
        const list = { user: { name: 'user', title: 'User' } };
        register.data(list);

        expect(register.data()).toBe(list);
    });

    // ...remaining tests...
});
