import Autocomplete from '../src/index';
import { list } from './data';

const ACRegister = Autocomplete.getRegister();
const inputElA = document.getElementById('input-element-a') as HTMLInputElement;
const inputElB = document.getElementById('input-element-b') as HTMLInputElement;
const inputElC = document.getElementById('input-element-c') as HTMLInputElement;

const textareaElA = document.getElementById('textarea-element-a') as HTMLTextAreaElement;
const textareaElB = document.getElementById('textarea-element-b') as HTMLTextAreaElement;
const textareaElC = document.getElementById('textarea-element-c') as HTMLTextAreaElement;

ACRegister.data(list);
ACRegister.add(inputElA);
ACRegister.add(inputElB);
ACRegister.add(inputElC);

ACRegister.add(textareaElA);
ACRegister.add(textareaElB);
ACRegister.add(textareaElC);

// ACRegister.add(inputElC);
// setTimeout(() => {
//     ACRegister.remove(inputElC);
// }, 2000);
