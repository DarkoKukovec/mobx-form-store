/** @module mobx-from-store/messages */

const prefix = '[mobx-form-store]';
const docs = 'https://example.com';

/** @exports Message for a missing submit action method */
export const missingSubmitAction = `${prefix} submitAction method is not defined or not a function. This method allows you to call submit() on the form. Read through the documentation ${docs}/test for examles and information about this.`;

/** @exports Message for a non promis result of submit action */
export const notPromiseSubmitAction = `${prefix} submitAction has to be a promise. Read through the documentation ${docs}/test for examles and information about this.`;

/** @exports Message for action errors not being an array */
export const notArrayActionErrors = `${prefix} action errors rejected from submitAction need to be in an array. Read through the documentation ${docs}/test for examles and information about this.`;
