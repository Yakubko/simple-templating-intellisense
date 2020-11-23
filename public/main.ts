import STIntellisense from '../src/';
import dataStructure from './source';

const STIRegister = STIntellisense.getRegister();
const inputElA = document.getElementById('colFormLabelSm') as HTMLInputElement;
const inputElB = document.getElementById('colFormLabel') as HTMLInputElement;

const textareaElA = document.getElementById('colFormLabelSmTextarea') as HTMLTextAreaElement;
const textareaElB = document.getElementById('colFormLabelTextarea') as HTMLTextAreaElement;

STIRegister.data(dataStructure.article);

STIRegister.add(inputElA);
STIRegister.add(inputElB);

STIRegister.add(textareaElA);
STIRegister.add(textareaElB);

// STIRegister.add(inputElC);
// setTimeout(() => {
//     STIRegister.remove(inputElC);
// }, 2000);
