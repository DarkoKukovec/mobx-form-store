/** @module mobx-from-store/FormStore */

import {action, computed, extendObservable, runInAction, toJS} from 'mobx';

import {FormFieldStore} from './FormFieldStore';
import * as messages from './utils/messages';
import {progressEnum} from './utils/progressEnum';
import {noop, mapValues} from './utils/helpers';
import {required, minLength, maxLength, email, equals} from './utils/validators.js';

/**
 * Class representing a Form for a Mobx store
 *
 * @class
 * @classdesc Form for a Mobx store
 * @exports Form store
 */
export class FormStore {

  /**
   * Creates an instance of FormStore with an initial state
   *
   * @constructor
   * @param {Function} opt.submitAction - Method to be called when submitting the form
   * @param {Object} [opt.validators={}] - Validators for form fields
   * @param {Object} [opt.fields={}] - Fields for the from
   * @param {Object} [opt.response=null] - Response for intial state
   * @param {Object[]} [opt.actionErrors=[]] - Action errors for intial state
   */
  constructor({submitAction, validators = {}, fields = {}, response = null, actionErrors = []} = {}) {
    this.submitAction = submitAction;
    const validatorFunctions = this._initValidators(validators);

    const initialState = {
      response,
      loading: false,
      fields: this._initFields(fields, validators, validatorFunctions),
      _actionErrors: actionErrors
    };

    extendObservable(this, initialState);
  }

  /**
   * Initialize the built-in validator functions with user validators
   *
   * @private
   * @param {Object} validators - List of validators to add
   * @return {Object} Combined validators
   */
  _initValidators(validators) {
    const predefinedValidatorFunctions = {
      required,
      minLength,
      maxLength,
      email,
      equals
    };

    return Object.assign(predefinedValidatorFunctions, validators);
  }

  /**
   * Method for setting the initial state of the form
   *
   * @private
   * @param {Object} fields - User defined fields
   * @param {Object} validators - Validators for fields
   * @param {Object} validatorFunctions - All available validators
   * @return {Object} Initalized form fields
   */
  _initFields(fields, validators, validatorFunctions) {
    const fieldModels = {};

    // Initialize the fields
    for (const name of Object.keys(fields)) {
      const field = fields[name] || {};

      const initialFieldState = Object.assign({
        name,
        validators,
        validatorFunctions,
        value: field.value,
        actionErrors: field.actionErrors || []
      }, field);

      fieldModels[name] = new FormFieldStore(initialFieldState);
    }

    return fieldModels;
  }

  /**
   * Validate the form fields
   *
   * @public
   * @readonly
   * @return {Boolean} Is the form valid
   */
  @computed get valid() {
    return this.fieldList.every((field) => field.valid);
  }

  /**
   * Check if the form fields are dirty
   *
   * @public
   * @readonly
   * @return {Boolean} Is the form dirty
   */
  @computed get dirty() {
    return this.fieldList.some((field) => field.dirty);
  }

  /**
   * Check if the form is submitted
   *
   * @public
   * @readonly
   * @return {Boolean} Is the form submitted
   */
  @computed get isSubmitted() {
    return Boolean(this.response);
  }

  /**
   * Get the form fields errors
   *
   * @public
   * @readonly
   * @return {Object} Object where the keys are field names and the values are arrays of error names
   */
  @computed get errors() {
    return mapValues(this.fieldList, 'name', 'errors');
  }

  /**
   * Get the action errors on the form or on wrong fields
   *
   * @public
   * @readonly
   * @return {Object[]} List of errors
   */
  @computed get actionErrors() {
    return this._actionErrors;
  }

  /**
   * Get the form data
   *
   * @public
   * @readonly
   * @return {Object} Object with the form data
   */
  @computed get formData() {
    return mapValues(this.fieldList, 'name', 'value');
  }

  /**
   * Get list of field models
   *
   * @public
   * @readonly
   * @return {Object[]} List of fields
   */
  @computed get fieldList() {
    return Object.values(this.fields);
  }

  /**
   * Get the current progress state from enum
   *
   * @public
   * @readonly
   * @return {String} Current progress state
   */
  @computed get progress() {
    if (this.isSubmitted) {
      return progressEnum.DONE;
    }

    if (this.loading) {
      return progressEnum.IN_PROGRESS;
    }

    if (this.actionErrors.length > 0) {
      return progressEnum.ERROR;
    }

    return progressEnum.NONE;
  }

  /**
   * Sets the action errors from fields.
   *
   * @private
   * @method
   * @param {Object[]} errors - List of JSON action errors
   * @return {undefined}
   */
  @action _setAactionErrors(errors) {
    this.resetActionErrors();
    errors.forEach((error) => {
      const field = this.fieldList.find((item) => item.name === error.field);
      if (field) {
        field.addAactionError(error);
      } else {
        this._actionErrors.push(error);
      }
    });
  }

  /**
   * Reset the fields to initial values
   *
   * @public
   * @method
   * @return {undefined}
   */
  @action reset() {
    this.fieldList.map((field) => field.reset());
    this.response = null;
    this.loading = false;
    this.resetActionErrors();
  }

  /**
   * Resets the action errors on Form and Field stores
   *
   * @public
   * @method
   * @return {undefined}
   */
  @action resetActionErrors() {
    this._actionErrors = [];
    this.fieldList.map((field) => field.resetActionErrors());
  }

  /**
   * Handle the form submit
   *
   * @public
   * @method
   * @throws {Error|Object[]} Throws an error from action
   * @return {Promise} Promise for submit end
   */
  @action submit() {
    if (this.loading) {
      return this.loading;
    }

    if (!this.submitAction) {
      return Promise.reject(messages.missingSubmitAction);
    }

    const submitActionLoader = this.submitAction(this.formData);
    if (!(submitActionLoader instanceof Promise)) {
      return Promise.reject(messages.notPromiseSubmitAction);
    }

    this.loading = this._processSubmitAction(submitActionLoader);

    return this.loading;
  }

  /**
   * Handles user submit action and handles action errors and submit data
   *
   * @private
   * @method
   * @param {Object} submitActionLoader - User submit action promise
   * @returns {Object} Promise with handeled resovle and reject
   */
  _processSubmitAction(submitActionLoader) {
    return submitActionLoader.then((data = {}) => {
      runInAction(() => {
        this.response = data;
        this.fieldList.map((field) => field.resetInitialValue());
        this.resetActionErrors();
      });
    }).catch((e) => {
      runInAction(() => {
        this.response = null;
        this.loading = false;
      });

      if (e instanceof Error) {
        return Promise.reject(e);
      }

      if (e instanceof Array) {
        this._setAactionErrors(e);
        return Promise.resolve();
      }

      return Promise.reject(messages.notArrayActionErrors);
    });
  }

  /**
   * Method to serialize the store data
   *
   * @public
   * @method
   * @return {Object} Serialized store data
   */
  toJS() {
    const serializedFields = this.fieldList.map((field) => field.toJS());

    return {
      actionErrors: toJS(this._actionErrors),
      response: toJS(this.response),
      fields: mapValues(serializedFields, 'name')
    };
  }
}
