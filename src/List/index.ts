import ListDOM from './ListDOM';
import { AllowedElements } from '../types';

export type ListData = Record<string, any>;

type ListActiveRegister = {
    name: string;
    element: AllowedElements | null;
    scrollableElements: (AllowedElements | Window)[];
};
type ListState = {
    visible: boolean;
    data: string[];
    partialFilter: string;
    selectedIndex: number;
};

class List {
    private listDOM: ListDOM;
    private registersData: Record<string, ListData> = {};
    private activeRegister: ListActiveRegister = {
        element: null,
        name: '',
        scrollableElements: [],
    };

    private state: ListState = {
        visible: false,
        data: [],
        partialFilter: '',
        selectedIndex: 0,
    };

    constructor() {
        this.listDOM = new ListDOM();
    }

    data(name: string, data?: ListData): ListData {
        if (data) this.registersData[name] = data;

        return this.registersData[name];
    }

    getState(): ListState {
        return this.state;
    }

    attach(registerName: string, element: AllowedElements): void {
        if (this.activeRegister.element) {
            if (element.isSameNode(this.activeRegister.element)) return;
            else this.detach();
        }

        const { scrollable, zIndex } = this.getParentsConf(element);

        this.activeRegister.name = registerName;
        this.activeRegister.element = element;
        this.activeRegister.scrollableElements = scrollable;

        this.listDOM.getElement().style.zIndex = zIndex ? (zIndex + 1).toString() : 'auto';

        this.activeRegister.scrollableElements.forEach((node) => {
            node.addEventListener('scroll', this, false);
        });

        this.align();
    }

    detach(): void {
        this.activeRegister.scrollableElements.forEach((node) => {
            node.removeEventListener('scroll', this, false);
        });

        this.activeRegister.name = '';
        this.activeRegister.element = null;
        this.activeRegister.scrollableElements = [];
    }

    handleEvent(event: Event): void {
        if (event.type === 'scroll') this.hide();
    }

    align(): void {
        if (this.state.visible) this.listDOM.alignTo(this.activeRegister.element);
    }

    show(): void {
        if (this.state.visible) return;

        this.state = { ...this.state, visible: true };
        this.listDOM.show();
    }

    hide(): void {
        this.state = { ...this.state, visible: false };
        this.listDOM.hide();
    }

    bindData(data: string[]): void {
        this.state = { ...this.state, selectedIndex: 0 };
        this.listDOM.bindData(data);
    }

    filter(filter: string): void {
        const { partialFilter, data } = this.getFilteredData(filter);
        this.state = { ...this.state, partialFilter, data };

        if (data.length > 0) {
            this.show();
            this.bindData(data);
        } else this.hide();
    }

    selectByDirection(direction: 'up' | 'down'): void {
        if (this.state.data.length > 1) {
            this.state.selectedIndex = this.mod(this.state.selectedIndex + (direction === 'down' ? 1 : -1), this.state.data.length);
            this.listDOM.select(this.state.selectedIndex);
        }
    }

    private getFilteredData(path: string): { partialFilter: string; data: string[] } {
        const data = this.registersData[this.activeRegister.name];
        const fnGetScopeLevel = (_path: string[], _data: ListData) => {
            if (_path.length > 1) {
                const key = _path.shift();
                if (_data[key]) {
                    return fnGetScopeLevel(_path, _data[key]);
                }
                return null;
            } else if (_path.length === 1) {
                return _data;
            }

            return null;
        };

        const pathList = path.split('.');
        const filteredData = fnGetScopeLevel(pathList, data);
        let retData = filteredData ? Object.keys(filteredData) : [];
        retData.sort();

        if (retData && pathList[0]) {
            retData = retData.filter((item) => item.startsWith(pathList[0]));
            if (retData.length === 1 && pathList[0] === retData[0]) {
                retData = [];
            }
        }

        return { partialFilter: pathList[0], data: retData };
    }

    private getParentsConf(
        node: AllowedElements,
        data: { scrollable: (AllowedElements | Window)[]; zIndex: number } = {
            scrollable: [],
            zIndex: 0,
        },
    ): { scrollable: (AllowedElements | Window)[]; zIndex: number } {
        if (node == null) return data;
        if (node === document.body) {
            data.scrollable.push(window);
            return data;
        }

        if (node.scrollHeight > node.clientHeight || node.tagName === 'TEXTAREA') {
            data.scrollable.push(node);
        }

        data.zIndex = Math.max(data.zIndex, parseInt(window.getComputedStyle(node).getPropertyValue('z-index')) || 0);

        return this.getParentsConf(node.parentNode as AllowedElements, data);
    }

    private mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }
}

export default new List();
