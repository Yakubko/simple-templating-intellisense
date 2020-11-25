import STIntellisense from '../src';
import Register from '../src/Register';

describe('STIntellisense', () => {
    // https://ilikekillnerds.com/2020/02/testing-event-listeners-in-jest-without-using-a-library/

    it('Get register', () => {
        const register = STIntellisense.getRegister();

        expect(register).toBeInstanceOf(Register);
    });

    it('Get same default register', () => {
        const register = STIntellisense.getRegister();
        const defaultRegister = STIntellisense.getRegister('default');

        expect(register).toBe(defaultRegister);
    });

    it('Get another register', () => {
        const register = STIntellisense.getRegister();
        const myOwnRegister = STIntellisense.getRegister('myOwnRegister');

        expect(register).not.toBe(myOwnRegister);
    });

    it('Remove default register', () => {
        const defaultRegister = STIntellisense.getRegister();
        STIntellisense.removeRegister();
        const defaultRegisterAfterDelete = STIntellisense.getRegister();

        expect(defaultRegister).not.toBe(defaultRegisterAfterDelete);
    });

    it('Remove custom register', () => {
        const customRegister = STIntellisense.getRegister('customRegisterName');
        STIntellisense.removeRegister('customRegisterName');
        const customRegisterWithSameName = STIntellisense.getRegister('customRegisterName');

        expect(customRegister).not.toBe(customRegisterWithSameName);
    });

    it('Remove undefined register', () => {
        STIntellisense.removeRegister('undefinedRegisterName');

        expect(true).toBeTruthy();
    });

    it('Remove all registers', () => {
        const defaultRegister = STIntellisense.getRegister();
        const customRegister = STIntellisense.getRegister('customRegisterName');

        STIntellisense.clean();

        const newDefaultRegister = STIntellisense.getRegister();
        const newCustomRegister = STIntellisense.getRegister('customRegisterName');

        expect(defaultRegister).not.toBe(newDefaultRegister);
        expect(customRegister).not.toBe(newCustomRegister);
    });
});
