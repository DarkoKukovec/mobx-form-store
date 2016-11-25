import {action, computed, extendObservable} from 'mobx';

import ObservableStore from './ObservableStore';
import FormFieldStore from './FormFieldStore';
import * as messages from './messages';
import progressEnum from './progressEnum';
import {required, minLength, maxLength, email, equals} from './validators.js';

class FormStore extends ObservableStore {

  constructor({processRequest} = {}) {
    super();

    this.processRequest = processRequest;

    if (!processRequest || typeof processRequest !== 'function') {
      console.warn(messages.missingProcessRequest); // eslint-disable-line no-console
    }
  }

  /**
   * Method for setting the initial state of the form
   *
   * @private
   * @param {Object} [initialState={}] - Initial state that should be set
   * @param {Object} [stores={}] - Application store
   * @return {undefined}
   */
  @action _initData(initialState = {}, stores = {}) {
    const fieldModels = {};
    this._initValidators();

    this.KeysStore = stores.keys;

    // Merge the custom validators with the built-in validators
    Object.assign(this._validators, this.validators || {});

    // Initialize the fields
    for (const field of Object.keys(this.fields)) {
      const fieldState = initialState && initialState[field];
      const initialFieldState = Object.assign({
        value: (fieldState && fieldState.value)
          ? initialState[field].value
          : this.fields[field].defaultValue,
        _dirty: (fieldState && fieldState.dirty) || false,
        apiErrors: (fieldState && fieldState.apiErrors) || false,
        _validators: this._validators,
        name: field
      }, this.fields[field]);
      fieldModels[field] = new FormFieldStore(initialFieldState);
    }

    extendObservable(this, Object.assign({
      progress: progressEnum.NONE,
      loading: false,
      submitted: false,
      apiErrors: []
    }, fieldModels));
  }

  /**
   * Validate the form fields
   *
   * @return {Boolean} Is the form valid
   */
  // @computed get valid() {
  // }

  /**
   * Check if the form fields are dirty
   *
   * @return {Boolean} Is the form dirty
   */
  // @computed get dirty() {
  // }

  /**
   * Reset dirty flag on all form fields
   *
   * @return {undefined}
   */
  // @action resetDirty() {
  // }

  /**
   * Get the form fields errors
   *
   * @return {Object} Object where the keys are field names and the values are arrays of error names
   */
  // @computed get errors() {
  // }

  /**
   * Initialize the built-in validator functions
   *
   * @return {undefined}
   */
  _initValidators() {
    this._validators = {
      required: required.bind(this),
      minLength: minLength.bind(this),
      maxLength: maxLength.bind(this),
      email: email.bind(this),
      equals: equals.bind(this)
    };
  }

  /**
   * Reset the fields to initial values
   *
   * @return {undefined}
   */
  // @action reset() {
  // }

  /**
   * Clear the API errors from fields
   *
   * @return {undefined}
   */
  // _clearApiErrors() {
  // }

  /**
   * Sets the API errors from fields.
   *
   * @param {Object[]} errors - List of JSON API errors
   * @return {undefined}
   */
  // @action setApiErrors(errors) {
  // }

  /**
   * Get list of field models
   *
   * @return {Object[]} List of fields
   */
  // get fieldList() {
  // }

  /**
   * Get the form data
   *
   * @return {Object} Object with the form data
   */
  // get formData() {
  // }

  /**
   * Handle the form submit
   *
   * @throws {Error|Object[]} Throws an error from API
   * @return {Promise} Promise for submit end
   */
  // @action async submit() {
  // }
}

module.exports = {
  FormFieldStore,
  FormStore,
  progressEnum
};
