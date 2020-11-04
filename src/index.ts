import Register from './Register';

export default class Autocomplete {
    private static groups: Record<string, Register> = {};

    public static getRegister(name = 'default'): Register {
        let group = Autocomplete.groups[name];
        if (group === undefined) {
            group = new Register(name);
            Autocomplete.groups[name] = group;
        }

        return group;
    }
}
