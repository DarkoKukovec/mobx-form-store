export const prefix = '[mobx-form-store]';
const docs = 'https://example.com';

export const missingProcessRequest = `${prefix} processRequest method is not defined or not a function. This method allows you to call submit() on the form. Read through the documentation ${docs}/test for examles and information about this.`;

export const notPromiseProcessRequest = `${prefix} processRequest has to be a promise. Read through the documentation ${docs}/test for examles and information about this.`;

export const notArrayApiErrors = `${prefix} API errors rejected from processRequest need to be in an array. Read through the documentation ${docs}/test for examles and information about this.`;
