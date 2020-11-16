import Component, { IntellisenseList } from './Component';
import STIntellisense from '../';
import { AllowedElements, IntellisenseData } from '../types';

const _mod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
};

class List {
    private forRegister: string | null;

    private visibleData: IntellisenseList[] = [];
    private selectedIndex = 0;

    attach(element: AllowedElements, registerName: string): void {
        this.forRegister = registerName;
        this.visibleData = [];
        this.selectedIndex = 0;

        Component.attach(element);
    }

    detach(): void {
        this.forRegister = null;
        this.visibleData = [];
        this.selectedIndex = 0;

        Component.detach();
    }

    show(filter: string): void {
        this.visibleData = this.getFilteredData(filter);
        this.selectedIndex = 0;

        Component.renderList(this.visibleData);
    }

    hide(): void {
        Component.renderList([]);
    }

    select(direction?: 'up' | 'down'): IntellisenseList | null {
        if (direction && this.visibleData.length > 1) {
            this.selectedIndex = _mod(this.selectedIndex + (direction === 'down' ? 1 : -1), this.visibleData.length);
            Component.select(this.selectedIndex, this.visibleData[this.selectedIndex]);
        }

        return this.visibleData[this.selectedIndex] || null;
    }

    isVisible(): boolean {
        return Component.isVisible();
    }

    private getFilteredData(path: string): IntellisenseList[] {
        const data = STIntellisense.getRegister(this.forRegister).data();

        const fnGetScopeLevel = (_path: string[], _data: IntellisenseData): IntellisenseList[] => {
            if (_path.length > 1) {
                const key = _path.shift();
                if (_data[key] && _data[key].nestedData) {
                    return fnGetScopeLevel(_path, _data[key].nestedData);
                }
                return [];
            } else if (_path.length === 1) {
                const output: IntellisenseList[] = [];
                for (const [key, value] of Object.entries(_data)) {
                    output.push({ name: key, autocomplete: key.substr(_path[0].length), object: value });
                }

                return output;
            }

            return [];
        };

        const pathList = path.split('.');
        let filteredData = fnGetScopeLevel(pathList, data);

        if (filteredData && pathList[0]) {
            filteredData = filteredData.filter((item) => item.name.startsWith(pathList[0]));

            if (filteredData.length === 1 && filteredData[0].name === pathList[0]) {
                filteredData = [];
            }
        }

        filteredData.sort((a, b) => {
            return (a.object.priority || Number.POSITIVE_INFINITY) - (b.object.priority || Number.POSITIVE_INFINITY) || a.name.localeCompare(b.name);
        });

        return filteredData;
    }
}

export default new List();
