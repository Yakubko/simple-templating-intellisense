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

    public removeRegister(name = 'default'): void {
        STIntellisense.registers[name]?.clean();
    }

    public static clean(): void {
        for (const name in this.registers) {
            STIntellisense.registers[name].clean();
        }

        STIntellisense.registers = {};
    }
}
