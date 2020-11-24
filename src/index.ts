import Register from './Register';

export default class STIntellisense {
    private static registers: Record<string, Register> = {};

    public static getRegister(name = 'default'): Register {
        let register = STIntellisense.registers[name];
        if (register === undefined) {
            register = new Register(name);
            STIntellisense.registers[name] = register;
        }

        return register;
    }

    public static removeRegister(name = 'default'): void {
        if (STIntellisense.registers[name]) {
            STIntellisense.registers[name].clean();
            delete STIntellisense.registers[name];
        }
    }

    public static clean(): void {
        for (const name in this.registers) {
            STIntellisense.registers[name].clean();
        }

        STIntellisense.registers = {};
    }
}
